from unittest.mock import patch


def test_webhook_verification(client):
    response = client.get(
        "/api/v1/whatsapp/webhook",
        params={"hub.mode": "subscribe", "hub.challenge": "test123"},
    )
    assert response.status_code == 200
    assert response.text == "test123"


@patch("app.routers.whatsapp.send_whatsapp_message", return_value=True)
def test_webhook_new_user(mock_send, client):
    response = client.post(
        "/api/v1/whatsapp/webhook",
        data={
            "From": "whatsapp:+919820055555",
            "Body": "hello",
            "NumMedia": "0",
        },
    )
    assert response.status_code == 200
    mock_send.assert_called_once()
    call_body = mock_send.call_args[0][1]
    assert "Welcome" in call_body


@patch("app.routers.whatsapp.send_whatsapp_message", return_value=True)
def test_webhook_help_command(mock_send, client):
    client.post(
        "/api/v1/whatsapp/webhook",
        data={"From": "whatsapp:+919820066666", "Body": "hi", "NumMedia": "0"},
    )
    mock_send.reset_mock()

    response = client.post(
        "/api/v1/whatsapp/webhook",
        data={"From": "whatsapp:+919820066666", "Body": "help", "NumMedia": "0"},
    )
    assert response.status_code == 200
    call_body = mock_send.call_args[0][1]
    assert "Commands" in call_body


@patch("app.routers.whatsapp.send_whatsapp_message", return_value=True)
def test_webhook_status_no_invoices(mock_send, client):
    client.post(
        "/api/v1/whatsapp/webhook",
        data={"From": "whatsapp:+919820077777", "Body": "hi", "NumMedia": "0"},
    )
    mock_send.reset_mock()

    response = client.post(
        "/api/v1/whatsapp/webhook",
        data={"From": "whatsapp:+919820077777", "Body": "status", "NumMedia": "0"},
    )
    assert response.status_code == 200
    call_body = mock_send.call_args[0][1]
    assert "No invoices" in call_body
