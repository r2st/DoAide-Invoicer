def test_health(client):
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["app"] == "DoAide Invoicer"


def test_readiness(client):
    response = client.get("/api/v1/health/ready")
    assert response.status_code == 200
    assert response.json()["ready"] is True


def test_root(client):
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["app"] == "DoAide Invoicer"
