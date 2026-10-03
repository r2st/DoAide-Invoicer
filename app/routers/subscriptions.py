from __future__ import annotations

import json
import logging

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.subscription import (
    CreateSubscriptionRequest,
    CreateSubscriptionResponse,
    SubscriptionOut,
    SubscriptionStatus,
    VerifyPaymentRequest,
)
from app.services.razorpay_service import (
    cancel_subscription,
    create_subscription,
    get_active_subscription,
    handle_webhook,
    verify_payment,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/subscriptions", tags=["subscriptions"])


@router.post("/create", response_model=CreateSubscriptionResponse)
def create_sub(
    payload: CreateSubscriptionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> CreateSubscriptionResponse:
    if current_user.plan == payload.plan:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Already on the {payload.plan} plan",
        )
    try:
        result = create_subscription(db, current_user, payload.plan)
    except Exception as exc:
        logger.exception("Failed to create subscription")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Could not create subscription with payment provider",
        ) from exc
    return CreateSubscriptionResponse(**result)


@router.post("/verify", response_model=SubscriptionOut)
def verify_sub(
    payload: VerifyPaymentRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> SubscriptionOut:
    try:
        sub = verify_payment(
            db,
            current_user,
            payload.razorpay_subscription_id,
            payload.razorpay_payment_id,
            payload.razorpay_signature,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc
    return SubscriptionOut.model_validate(sub)


@router.post("/webhook", status_code=status.HTTP_200_OK)
async def webhook(request: Request, db: Session = Depends(get_db)) -> dict:
    signature = request.headers.get("X-Razorpay-Signature", "")
    body = await request.body()
    try:
        payload = json.loads(body)
    except json.JSONDecodeError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid JSON",
        ) from exc

    try:
        handle_webhook(db, payload, signature)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc
    return {"status": "ok"}


@router.get("/status", response_model=SubscriptionStatus)
def sub_status(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> SubscriptionStatus:
    sub = get_active_subscription(db, current_user.id)
    return SubscriptionStatus(
        plan=current_user.plan,
        is_active=current_user.plan != "free",
        subscription=SubscriptionOut.model_validate(sub) if sub else None,
    )


@router.post("/cancel", response_model=SubscriptionStatus)
def cancel_sub(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> SubscriptionStatus:
    cancel_subscription(db, current_user)
    db.refresh(current_user)
    return SubscriptionStatus(
        plan=current_user.plan,
        is_active=False,
        subscription=None,
    )


@router.get("/config")
def sub_config() -> dict:
    return {"razorpay_key_id": settings.razorpay_key_id}
