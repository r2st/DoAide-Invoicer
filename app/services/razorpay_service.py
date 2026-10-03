from __future__ import annotations

import hashlib
import hmac
import logging

from sqlalchemy import desc
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.subscription import Subscription
from app.models.user import User

logger = logging.getLogger(__name__)

PLAN_PRICES = {
    "pro": 34900,
    "enterprise": 99900,
}


def _get_razorpay_client():
    import razorpay

    return razorpay.Client(auth=(settings.razorpay_key_id, settings.razorpay_key_secret))


def get_plan_id(plan: str) -> str:
    if plan == "pro":
        return settings.razorpay_plan_id_pro
    if plan == "enterprise":
        return settings.razorpay_plan_id_enterprise
    raise ValueError(f"Unknown plan: {plan}")


def create_subscription(db: Session, user: User, plan: str) -> dict:
    client = _get_razorpay_client()
    plan_id = get_plan_id(plan)

    rz_sub = client.subscription.create(
        {
            "plan_id": plan_id,
            "total_count": 12,
            "quantity": 1,
            "notes": {
                "user_id": str(user.id),
                "plan": plan,
            },
        }
    )

    sub = Subscription(
        user_id=user.id,
        razorpay_subscription_id=rz_sub["id"],
        razorpay_plan_id=plan_id,
        plan_tier=plan,
        status="created",
    )
    db.add(sub)
    db.commit()
    db.refresh(sub)

    return {
        "subscription_id": rz_sub["id"],
        "razorpay_key_id": settings.razorpay_key_id,
        "plan": plan,
        "amount": PLAN_PRICES[plan],
        "currency": "INR",
    }


def verify_payment(
    db: Session,
    user: User,
    razorpay_subscription_id: str,
    razorpay_payment_id: str,
    razorpay_signature: str,
) -> Subscription:
    expected = hmac.new(
        settings.razorpay_key_secret.encode(),
        f"{razorpay_payment_id}|{razorpay_subscription_id}".encode(),
        hashlib.sha256,
    ).hexdigest()

    if not hmac.compare_digest(expected, razorpay_signature):
        raise ValueError("Invalid payment signature")

    sub = (
        db.query(Subscription)
        .filter(
            Subscription.razorpay_subscription_id == razorpay_subscription_id,
            Subscription.user_id == user.id,
        )
        .first()
    )
    if not sub:
        raise ValueError("Subscription not found")

    sub.status = "active"
    sub.razorpay_payment_id = razorpay_payment_id

    user.plan = sub.plan_tier
    db.commit()
    db.refresh(sub)
    return sub


def handle_webhook(db: Session, payload: dict, signature: str) -> None:
    expected = hmac.new(
        settings.razorpay_webhook_secret.encode(),
        str(payload).encode(),
        hashlib.sha256,
    ).hexdigest()

    if not hmac.compare_digest(expected, signature):
        logger.warning("Webhook signature mismatch")
        raise ValueError("Invalid webhook signature")

    event = payload.get("event", "")
    sub_entity = (
        payload.get("payload", {}).get("subscription", {}).get("entity", {})
    )
    sub_id = sub_entity.get("id")

    if not sub_id:
        return

    sub = (
        db.query(Subscription)
        .filter(Subscription.razorpay_subscription_id == sub_id)
        .first()
    )
    if not sub:
        logger.warning("Webhook for unknown subscription %s", sub_id)
        return

    if event == "subscription.activated":
        sub.status = "active"
        user = db.get(User, sub.user_id)
        if user:
            user.plan = sub.plan_tier
    elif event == "subscription.cancelled":
        sub.status = "cancelled"
        user = db.get(User, sub.user_id)
        if user:
            user.plan = "free"
    elif event == "subscription.paused":
        sub.status = "paused"
    elif event == "subscription.resumed":
        sub.status = "active"
    elif event in ("subscription.charged", "subscription.completed"):
        sub.status = "active"

    db.commit()


def get_active_subscription(db: Session, user_id: int) -> Subscription | None:
    return (
        db.query(Subscription)
        .filter(
            Subscription.user_id == user_id,
            Subscription.status.in_(["active", "created"]),
        )
        .order_by(desc(Subscription.created_at))
        .first()
    )


def cancel_subscription(db: Session, user: User) -> Subscription | None:
    sub = get_active_subscription(db, user.id)
    if not sub:
        return None

    if sub.status == "active":
        client = _get_razorpay_client()
        client.subscription.cancel(sub.razorpay_subscription_id)

    sub.status = "cancelled"
    user.plan = "free"
    db.commit()
    db.refresh(sub)
    return sub
