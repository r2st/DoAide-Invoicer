import pytest

from app.models.user import User
from app.core.security import hash_password
from app.services.usage_service import check_quota, get_current_month_usage, increment_usage


@pytest.fixture()
def test_user(db_session):
    user = User(
        phone="+919820099001",
        hashed_password=hash_password("testpass123"),
        plan="free",
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


def test_initial_usage_is_zero(db_session, test_user):
    assert get_current_month_usage(db_session, user_id=test_user.id) == 0


def test_increment_usage(db_session, test_user):
    count = increment_usage(db_session, user_id=test_user.id)
    assert count == 1
    count = increment_usage(db_session, user_id=test_user.id)
    assert count == 2


def test_check_quota_free_tier(db_session, test_user):
    allowed, used, limit = check_quota(db_session, user_id=test_user.id, plan="free")
    assert allowed is True
    assert used == 0
    assert limit == 5


def test_check_quota_pro_unlimited(db_session, test_user):
    allowed, _, _ = check_quota(db_session, user_id=test_user.id, plan="pro")
    assert allowed is True


def test_check_quota_exceeded(db_session, test_user, monkeypatch):
    from app.core.config import settings
    monkeypatch.setattr(settings, "free_tier_monthly_limit", 2)

    increment_usage(db_session, user_id=test_user.id)
    increment_usage(db_session, user_id=test_user.id)

    allowed, used, limit = check_quota(db_session, user_id=test_user.id, plan="free")
    assert allowed is False
    assert used == 2
