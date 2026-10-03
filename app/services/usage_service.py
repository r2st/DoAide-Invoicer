from __future__ import annotations

from datetime import date

from sqlalchemy import and_
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.usage_tracking import UsageTracking


def get_current_month_usage(db: Session, user_id: int) -> int:
    today = date.today()
    first_of_month = today.replace(day=1)
    usage = db.query(UsageTracking).filter(
        and_(
            UsageTracking.user_id == user_id,
            UsageTracking.month == first_of_month,
        )
    ).first()
    return usage.invoice_count if usage else 0


def increment_usage(db: Session, user_id: int) -> int:
    today = date.today()
    first_of_month = today.replace(day=1)
    usage = db.query(UsageTracking).filter(
        and_(
            UsageTracking.user_id == user_id,
            UsageTracking.month == first_of_month,
        )
    ).first()

    if usage:
        usage.invoice_count += 1
    else:
        usage = UsageTracking(
            user_id=user_id,
            month=first_of_month,
            invoice_count=1,
        )
        db.add(usage)

    db.flush()
    return usage.invoice_count


PLAN_LIMITS = {
    "free": None,
    "pro": 0,
    "enterprise": 0,
    "ca": 0,
}


def get_plan_limit(plan: str) -> int:
    if PLAN_LIMITS.get(plan, None) == 0:
        return 0
    return settings.free_tier_monthly_limit


def check_quota(db: Session, user_id: int, plan: str) -> tuple[bool, int, int]:
    if plan in ("pro", "enterprise", "ca"):
        return True, 0, 0

    limit = settings.free_tier_monthly_limit
    used = get_current_month_usage(db, user_id)
    return used < limit, used, limit
