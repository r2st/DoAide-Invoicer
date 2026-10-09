from __future__ import annotations

import json
from unittest.mock import patch


def test_submit_feedback_success(client, tmp_path):
    feedback_file = tmp_path / "feedback.json"
    with patch("app.routers.feedback.FEEDBACK_FILE", feedback_file):
        resp = client.post("/api/feedback", json={"category": "Bug", "message": "It crashes"})
    assert resp.status_code == 201
    assert resp.json() == {"status": "ok"}
    entries = json.loads(feedback_file.read_text())
    assert len(entries) == 1
    assert entries[0]["category"] == "Bug"
    assert entries[0]["message"] == "It crashes"
    assert "timestamp" in entries[0]


def test_submit_feedback_appends(client, tmp_path):
    feedback_file = tmp_path / "feedback.json"
    feedback_file.write_text(json.dumps([{"category": "General", "message": "old", "timestamp": "t"}]))
    with patch("app.routers.feedback.FEEDBACK_FILE", feedback_file):
        resp = client.post("/api/feedback", json={"category": "Feature Request", "message": "Add charts"})
    assert resp.status_code == 201
    entries = json.loads(feedback_file.read_text())
    assert len(entries) == 2


def test_submit_feedback_invalid_category(client):
    resp = client.post("/api/feedback", json={"category": "Spam", "message": "hello"})
    assert resp.status_code == 422


def test_submit_feedback_empty_message(client):
    resp = client.post("/api/feedback", json={"category": "Bug", "message": ""})
    assert resp.status_code == 422


def test_submit_feedback_missing_fields(client):
    resp = client.post("/api/feedback", json={})
    assert resp.status_code == 422
