import io
from unittest.mock import patch

from PIL import Image


def _create_test_image() -> bytes:
    img = Image.new("RGB", (100, 100), color="white")
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    buf.seek(0)
    return buf.read()


@patch("app.services.ocr_pipeline.extract_text_ocr", return_value="OCR text")
@patch("app.services.ocr_pipeline.extract_structured_data")
def test_export_csv(mock_extract, mock_ocr, auth_client):
    mock_extract.return_value = {
        "vendor_name": "Export Test",
        "invoice_number": "INV-EXP-001",
        "confidence": 0.9,
        "line_items": [],
    }
    image_data = _create_test_image()
    auth_client.post(
        "/api/v1/invoices/upload",
        files={"file": ("test.jpg", image_data, "image/jpeg")},
    )

    response = auth_client.get("/api/v1/invoices/export?format=csv")
    assert response.status_code == 200
    assert "text/csv" in response.headers["content-type"]
    assert "INV-EXP-001" in response.text


@patch("app.services.ocr_pipeline.extract_text_ocr", return_value="OCR text")
@patch("app.services.ocr_pipeline.extract_structured_data")
def test_export_excel(mock_extract, mock_ocr, auth_client):
    mock_extract.return_value = {
        "vendor_name": "Excel Test",
        "confidence": 0.9,
        "line_items": [],
    }
    image_data = _create_test_image()
    auth_client.post(
        "/api/v1/invoices/upload",
        files={"file": ("test.jpg", image_data, "image/jpeg")},
    )

    response = auth_client.get("/api/v1/invoices/export?format=excel")
    assert response.status_code == 200
    assert "spreadsheetml" in response.headers["content-type"]


@patch("app.services.ocr_pipeline.extract_text_ocr", return_value="OCR text")
@patch("app.services.ocr_pipeline.extract_structured_data")
def test_export_gst_format(mock_extract, mock_ocr, auth_client):
    mock_extract.return_value = {
        "vendor_name": "GST Export",
        "confidence": 0.9,
        "line_items": [],
    }
    image_data = _create_test_image()
    auth_client.post(
        "/api/v1/invoices/upload",
        files={"file": ("test.jpg", image_data, "image/jpeg")},
    )

    response = auth_client.get("/api/v1/invoices/export?format=gst&period=102026")
    assert response.status_code == 200
    assert "application/json" in response.headers["content-type"]
