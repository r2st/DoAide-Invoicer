from unittest.mock import MagicMock, patch

import pytest

from app.models.subscription import Subscription
from app.models.user import User
from app.core.security import hash_password
from app.services.razorpay_service import (
    PLAN_PRICES,
    get_active_subscription,
    get_plan_id,
)


@pytest.fixture()
def test_user(db_session):
    user = User(
        phone="+919820099002",
        hashed_password=hash_password("testpass123"),
        plan="free",
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture()
def pro_subscription(db_session, test_user):
    sub = Subscription(
        user_id=test_user.id,
        razorpay_subscription_id="sub_test_123",
        razorpay_plan_id="plan_test_pro",
        plan_tier="pro",
        status="active",
    )
    db_session.add(sub)
    db_session.commit()
    db_session.refresh(sub)
    return sub


class TestPlanPrices:
    def test_pro_price(self):
        assert PLAN_PRICES["pro"] == 34900

    def test_enterprise_price(self):
        assert PLAN_PRICES["enterprise"] == 99900


class TestGetPlanId:
    def test_pro_plan_id(self, monkeypatch):
        from app.core.config import settings
        monkeypatch.setattr(settings, "razorpay_plan_id_pro", "plan_pro_123")
        assert get_plan_id("pro") == "plan_pro_123"

    def test_enterprise_plan_id(self, monkeypatch):
        from app.core.config import settings
        monkeypatch.setattr(settings, "razorpay_plan_id_enterprise", "plan_ent_456")
        assert get_plan_id("enterprise") == "plan_ent_456"

    def test_unknown_plan_raises(self):
        with pytest.raises(ValueError, match="Unknown plan"):
            get_plan_id("unknown")


class TestGetActiveSubscription:
    def test_returns_none_when_no_subscription(self, db_session, test_user):
        assert get_active_subscription(db_session, test_user.id) is None

    def test_returns_active_subscription(self, db_session, test_user, pro_subscription):
        result = get_active_subscription(db_session, test_user.id)
        assert result is not None
        assert result.id == pro_subscription.id
        assert result.plan_tier == "pro"

    def test_ignores_cancelled_subscription(self, db_session, test_user):
        sub = Subscription(
            user_id=test_user.id,
            razorpay_subscription_id="sub_cancelled",
            razorpay_plan_id="plan_test_pro",
            plan_tier="pro",
            status="cancelled",
        )
        db_session.add(sub)
        db_session.commit()
        assert get_active_subscription(db_session, test_user.id) is None


class TestSubscriptionModel:
    def test_create_subscription(self, db_session, test_user):
        sub = Subscription(
            user_id=test_user.id,
            razorpay_subscription_id="sub_model_test",
            razorpay_plan_id="plan_test",
            plan_tier="pro",
            status="created",
        )
        db_session.add(sub)
        db_session.commit()
        db_session.refresh(sub)

        assert sub.id is not None
        assert sub.user_id == test_user.id
        assert sub.razorpay_subscription_id == "sub_model_test"
        assert sub.plan_tier == "pro"
        assert sub.status == "created"

    def test_subscription_status_default(self, db_session, test_user):
        sub = Subscription(
            user_id=test_user.id,
            razorpay_subscription_id="sub_default_status",
            razorpay_plan_id="plan_test",
            plan_tier="enterprise",
            status="created",
        )
        db_session.add(sub)
        db_session.commit()
        db_session.refresh(sub)
        assert sub.status == "created"


class TestSubscriptionEndpoints:
    def test_subscription_status_free_user(self, auth_client):
        resp = auth_client.get("/api/v1/subscriptions/status")
        assert resp.status_code == 200
        data = resp.json()
        assert data["plan"] == "free"
        assert data["is_active"] is False
        assert data["subscription"] is None

    def test_subscription_config(self, client, monkeypatch):
        from app.core.config import settings
        monkeypatch.setattr(settings, "razorpay_key_id", "rzp_test_key")
        resp = client.get("/api/v1/subscriptions/config")
        assert resp.status_code == 200
        assert resp.json()["razorpay_key_id"] == "rzp_test_key"

    def test_create_subscription_requires_auth(self, client):
        resp = client.post("/api/v1/subscriptions/create", json={"plan": "pro"})
        assert resp.status_code == 401

    def test_create_subscription_invalid_plan(self, auth_client):
        resp = auth_client.post("/api/v1/subscriptions/create", json={"plan": "invalid"})
        assert resp.status_code == 422

    @patch("app.routers.subscriptions.create_subscription")
    def test_create_subscription_success(self, mock_create, auth_client):
        mock_create.return_value = {
            "subscription_id": "sub_test_new",
            "razorpay_key_id": "rzp_test",
            "plan": "pro",
            "amount": 34900,
            "currency": "INR",
        }
        resp = auth_client.post("/api/v1/subscriptions/create", json={"plan": "pro"})
        assert resp.status_code == 200
        data = resp.json()
        assert data["subscription_id"] == "sub_test_new"
        assert data["plan"] == "pro"
        assert data["amount"] == 34900

    def test_verify_requires_auth(self, client):
        resp = client.post("/api/v1/subscriptions/verify", json={
            "razorpay_subscription_id": "sub_test",
            "razorpay_payment_id": "pay_test",
            "razorpay_signature": "sig_test",
        })
        assert resp.status_code == 401

    def test_cancel_requires_auth(self, client):
        resp = client.post("/api/v1/subscriptions/cancel")
        assert resp.status_code == 401

    def test_cancel_free_user(self, auth_client):
        resp = auth_client.post("/api/v1/subscriptions/cancel")
        assert resp.status_code == 200
        data = resp.json()
        assert data["plan"] == "free"
        assert data["is_active"] is False

    def test_webhook_invalid_json(self, client):
        resp = client.post(
            "/api/v1/subscriptions/webhook",
            content=b"not json",
            headers={"Content-Type": "application/json"},
        )
        assert resp.status_code == 400


class TestUsageWithNewPlans:
    def test_free_tier_limit_is_5(self, monkeypatch):
        from app.core.config import settings
        assert settings.free_tier_monthly_limit == 5

    def test_pro_unlimited(self, db_session, test_user):
        from app.services.usage_service import check_quota
        allowed, _, _ = check_quota(db_session, user_id=test_user.id, plan="pro")
        assert allowed is True

    def test_enterprise_unlimited(self, db_session, test_user):
        from app.services.usage_service import check_quota
        allowed, _, _ = check_quota(db_session, user_id=test_user.id, plan="enterprise")
        assert allowed is True

    def test_free_tier_limited(self, db_session, test_user, monkeypatch):
        from app.core.config import settings
        from app.services.usage_service import check_quota, increment_usage

        monkeypatch.setattr(settings, "free_tier_monthly_limit", 5)
        for _ in range(5):
            increment_usage(db_session, user_id=test_user.id)

        allowed, used, limit = check_quota(db_session, user_id=test_user.id, plan="free")
        assert allowed is False
        assert used == 5
        assert limit == 5
