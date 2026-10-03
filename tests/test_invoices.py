import io
import os
from unittest.mock import patch

from PIL import Image


def _create_test_image() -> bytes:
    img = Image.new("RGB", (100, 100), color="white")
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    buf.seek(0)
    return buf.read()


def test_list_invoices_empty(auth_client):
    response = auth_client.get("/api/v1/invoices")
    assert response.status_code == 200
    data = response.json()
    assert data["invoices"] == []
    assert data["total"] == 0


@patch("app.services.ocr_pipeline.extract_text_ocr", return_value="Sample OCR text")
@patch("app.services.ocr_pipeline.extract_structured_data")
def test_upload_invoice(mock_extract, mock_ocr, auth_client):
    mock_extract.return_value = {
        "vendor_name": "Test Vendor",
        "vendor_gstin": "27AAPFU0939F1ZV",
        "invoice_number": "INV-001",
        "subtotal": 10000,
        "total": 11800,
        "confidence": 0.9,
        "line_items": [
            {"description": "Item 1", "quantity": 1, "unit_price": 10000, "amount": 10000}
        ],
    }

    image_data = _create_test_image()
    response = auth_client.post(
        "/api/v1/invoices/upload",
        files={"file": ("test.jpg", image_data, "image/jpeg")},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["vendor_name"] == "Test Vendor"
    assert data["status"] == "extracted"


def test_get_invoice_not_found(auth_client):
    response = auth_client.get("/api/v1/invoices/99999")
    assert response.status_code == 404


@patch("app.services.ocr_pipeline.extract_text_ocr", return_value="OCR text")
@patch("app.services.ocr_pipeline.extract_structured_data")
def test_approve_invoice(mock_extract, mock_ocr, auth_client):
    mock_extract.return_value = {
        "vendor_name": "Approve Test",
        "confidence": 0.9,
        "line_items": [],
    }
    image_data = _create_test_image()
    upload = auth_client.post(
        "/api/v1/invoices/upload",
        files={"file": ("test.jpg", image_data, "image/jpeg")},
    )
    invoice_id = upload.json()["id"]

    response = auth_client.patch(f"/api/v1/invoices/{invoice_id}/approve")
    assert response.status_code == 200
    assert response.json()["status"] == "approved"


@patch("app.services.ocr_pipeline.extract_text_ocr", return_value="OCR text")
@patch("app.services.ocr_pipeline.extract_structured_data")
def test_reject_invoice(mock_extract, mock_ocr, auth_client):
    mock_extract.return_value = {
        "vendor_name": "Reject Test",
        "confidence": 0.9,
        "line_items": [],
    }
    image_data = _create_test_image()
    upload = auth_client.post(
        "/api/v1/invoices/upload",
        files={"file": ("test.jpg", image_data, "image/jpeg")},
    )
    invoice_id = upload.json()["id"]

    response = auth_client.patch(f"/api/v1/invoices/{invoice_id}/reject")
    assert response.status_code == 200
    assert response.json()["status"] == "rejected"


@patch("app.services.ocr_pipeline.extract_text_ocr", return_value="OCR text")
@patch("app.services.ocr_pipeline.extract_structured_data")
def test_delete_invoice(mock_extract, mock_ocr, auth_client):
    mock_extract.return_value = {
        "vendor_name": "Delete Test",
        "confidence": 0.9,
        "line_items": [],
    }
    image_data = _create_test_image()
    upload = auth_client.post(
        "/api/v1/invoices/upload",
        files={"file": ("test.jpg", image_data, "image/jpeg")},
    )
    invoice_id = upload.json()["id"]

    response = auth_client.delete(f"/api/v1/invoices/{invoice_id}")
    assert response.status_code == 204


@patch("app.services.ocr_pipeline.extract_text_ocr", return_value="OCR text")
@patch("app.services.ocr_pipeline.extract_structured_data")
def test_update_invoice(mock_extract, mock_ocr, auth_client):
    mock_extract.return_value = {
        "vendor_name": "Original",
        "confidence": 0.9,
        "line_items": [],
    }
    image_data = _create_test_image()
    upload = auth_client.post(
        "/api/v1/invoices/upload",
        files={"file": ("test.jpg", image_data, "image/jpeg")},
    )
    invoice_id = upload.json()["id"]

    response = auth_client.put(
        f"/api/v1/invoices/{invoice_id}",
        json={"vendor_name": "Updated Vendor"},
    )
    assert response.status_code == 200
    assert response.json()["vendor_name"] == "Updated Vendor"


def test_invoices_unauthenticated(client):
    response = client.get("/api/v1/invoices")
    assert response.status_code == 401
