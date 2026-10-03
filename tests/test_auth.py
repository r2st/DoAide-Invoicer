from tests.conftest import TEST_PASSWORD, TEST_PHONE


def test_register_success(client):
    response = client.post(
        "/api/v1/auth/register",
        json={"phone": "+919820000001", "password": "testpassword123"},
    )
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["user"]["phone"] == "+919820000001"
    assert data["user"]["plan"] == "free"


def test_register_duplicate_phone(client):
    client.post(
        "/api/v1/auth/register",
        json={"phone": "+919820000002", "password": "testpassword123"},
    )
    response = client.post(
        "/api/v1/auth/register",
        json={"phone": "+919820000002", "password": "anotherpass123"},
    )
    assert response.status_code == 409


def test_register_short_password(client):
    response = client.post(
        "/api/v1/auth/register",
        json={"phone": "+919820000003", "password": "short"},
    )
    assert response.status_code == 422


def test_login_success(client):
    client.post(
        "/api/v1/auth/register",
        json={"phone": TEST_PHONE, "password": TEST_PASSWORD},
    )
    response = client.post(
        "/api/v1/auth/login",
        json={"phone": TEST_PHONE, "password": TEST_PASSWORD},
    )
    assert response.status_code == 200
    assert "access_token" in response.json()


def test_login_wrong_password(client):
    client.post(
        "/api/v1/auth/register",
        json={"phone": "+919820000004", "password": "correctpassword1"},
    )
    response = client.post(
        "/api/v1/auth/login",
        json={"phone": "+919820000004", "password": "wrongpassword1"},
    )
    assert response.status_code == 401


def test_login_nonexistent_user(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"phone": "+919999999999", "password": "anypassword1"},
    )
    assert response.status_code == 401


def test_me_authenticated(auth_client):
    response = auth_client.get("/api/v1/auth/me")
    assert response.status_code == 200
    assert response.json()["phone"] == TEST_PHONE


def test_me_unauthenticated(client):
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401
