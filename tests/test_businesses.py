def test_list_clients_requires_ca_plan(auth_client):
    response = auth_client.get("/api/v1/clients")
    assert response.status_code == 403


def test_create_client_ca(ca_client):
    response = ca_client.post(
        "/api/v1/clients",
        json={"name": "Test Client", "gstin": "27AAPFU0939F1ZV"},
    )
    assert response.status_code == 201
    assert response.json()["name"] == "Test Client"


def test_list_clients_ca(ca_client):
    ca_client.post(
        "/api/v1/clients",
        json={"name": "Client 1"},
    )
    ca_client.post(
        "/api/v1/clients",
        json={"name": "Client 2"},
    )
    response = ca_client.get("/api/v1/clients")
    assert response.status_code == 200
    assert len(response.json()) == 2


def test_update_client(ca_client):
    create = ca_client.post(
        "/api/v1/clients",
        json={"name": "Original Name"},
    )
    client_id = create.json()["id"]

    response = ca_client.put(
        f"/api/v1/clients/{client_id}",
        json={"name": "Updated Name"},
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Updated Name"


def test_delete_client(ca_client):
    create = ca_client.post(
        "/api/v1/clients",
        json={"name": "To Delete"},
    )
    client_id = create.json()["id"]

    response = ca_client.delete(f"/api/v1/clients/{client_id}")
    assert response.status_code == 204
