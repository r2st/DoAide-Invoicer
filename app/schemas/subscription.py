from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class CreateSubscriptionRequest(BaseModel):
    plan: str = Field(pattern=r"^(pro|enterprise)$")


class CreateSubscriptionResponse(BaseModel):
    subscription_id: str
    razorpay_key_id: str
    plan: str
    amount: int
    currency: str = "INR"


class VerifyPaymentRequest(BaseModel):
    razorpay_subscription_id: str
    razorpay_payment_id: str
    razorpay_signature: str


class SubscriptionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    plan_tier: str
    status: str
    razorpay_subscription_id: str
    current_period_start: datetime | None = None
    current_period_end: datetime | None = None
    created_at: datetime


class SubscriptionStatus(BaseModel):
    plan: str
    is_active: bool
    subscription: SubscriptionOut | None = None
