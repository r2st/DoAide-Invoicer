from app.models.hsn_code import HSNCode


def test_search_hsn_by_code(auth_client, db_session):
    hsn = HSNCode(code="2523", description="Portland cement", gst_rate=28.0, category="Construction")
    db_session.add(hsn)
    db_session.commit()

    response = auth_client.get("/api/v1/hsn/search?q=2523")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["code"] == "2523"


def test_search_hsn_by_description(auth_client, db_session):
    hsn = HSNCode(code="8471", description="Automatic data processing machines", gst_rate=18.0)
    db_session.add(hsn)
    db_session.commit()

    response = auth_client.get("/api/v1/hsn/search?q=data+processing")
    assert response.status_code == 200
    assert len(response.json()) >= 1


def test_get_hsn_code(auth_client, db_session):
    hsn = HSNCode(code="7214", description="Steel bars and rods", gst_rate=18.0)
    db_session.add(hsn)
    db_session.commit()

    response = auth_client.get("/api/v1/hsn/7214")
    assert response.status_code == 200
    assert response.json()["description"] == "Steel bars and rods"


def test_get_hsn_not_found(auth_client):
    response = auth_client.get("/api/v1/hsn/9999")
    assert response.status_code == 404
