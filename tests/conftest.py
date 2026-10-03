from __future__ import annotations

import os
import tempfile

os.environ.setdefault("OPENROUTER_API_KEY", "")
os.environ.setdefault("JWT_SECRET", "test-secret-key-for-invoicer-tests")
os.environ.setdefault("DATABASE_URL", "sqlite+pysqlite:///:memory:")
os.environ.setdefault("ENVIRONMENT", "development")
os.environ.setdefault("UPLOAD_DIR", tempfile.mkdtemp(prefix="invoicer-uploads-"))
os.environ.setdefault("BCRYPT_ROUNDS", "4")

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402
from sqlalchemy import create_engine, event  # noqa: E402
from sqlalchemy.orm import sessionmaker  # noqa: E402
from sqlalchemy.pool import StaticPool  # noqa: E402

from app.core.database import Base, get_db  # noqa: E402
from app.main import app  # noqa: E402

TEST_PHONE = "+919820012345"
TEST_PASSWORD = "supersecret123"


@pytest.fixture()
def db_session():
    engine = create_engine(
        "sqlite+pysqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )

    @event.listens_for(engine, "connect")
    def _enforce_foreign_keys(dbapi_connection, _record):
        dbapi_connection.execute("PRAGMA foreign_keys=ON")

    Base.metadata.create_all(engine)
    TestingSession = sessionmaker(bind=engine, autoflush=False, autocommit=False)
    session = TestingSession()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(engine)
        engine.dispose()


@pytest.fixture()
def client(db_session):
    def _override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = _override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture()
def auth_client(client):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "phone": TEST_PHONE,
            "password": TEST_PASSWORD,
            "name": "Test User",
            "email": "test@example.com",
        },
    )
    assert response.status_code == 201, response.text
    client.headers.update({"Authorization": f"Bearer {response.json()['access_token']}"})
    return client


@pytest.fixture()
def ca_client(client):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "phone": "+919820099999",
            "password": TEST_PASSWORD,
            "name": "CA User",
            "email": "ca@example.com",
        },
    )
    assert response.status_code == 201, response.text
    token = response.json()["access_token"]

    from app.models.user import User
    from app.core.database import get_db
    db = next(app.dependency_overrides[get_db]())
    user = db.query(User).filter_by(phone="+919820099999").one()
    user.plan = "ca"
    db.commit()

    client.headers.update({"Authorization": f"Bearer {token}"})
    return client
