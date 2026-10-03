from __future__ import annotations

import logging
import time
from pathlib import Path
from typing import Any

from PIL import Image, ImageEnhance, ImageFilter

from app.services.openrouter_client import OpenRouterError, chat_json, is_configured

logger = logging.getLogger(__name__)

EXTRACTION_PROMPT = """Given this invoice text extracted via OCR, extract the following fields as JSON:
{
  "vendor_name": "string or null",
  "vendor_gstin": "string (15 chars) or null",
  "vendor_address": "string or null",
  "vendor_state_code": "string (2 chars) or null",
  "buyer_name": "string or null",
  "buyer_gstin": "string (15 chars) or null",
  "buyer_state_code": "string (2 chars) or null",
  "invoice_number": "string or null",
  "invoice_date": "YYYY-MM-DD or null",
  "due_date": "YYYY-MM-DD or null",
  "line_items": [
    {
      "description": "string",
      "hsn_code": "string or null",
      "quantity": number or null,
      "unit": "string or null",
      "unit_price": number or null,
      "tax_rate": number or null,
      "amount": number or null
    }
  ],
  "subtotal": number or null,
  "cgst": number or null,
  "sgst": number or null,
  "igst": number or null,
  "total": number or null,
  "confidence": 0.0 to 1.0
}

Return valid JSON only. If a field is unreadable, set it to null.

OCR Text:
"""


def preprocess_image(image_path: str) -> Image.Image:
    img = Image.open(image_path)
    if img.mode != "L":
        img = img.convert("L")
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(1.5)
    img = img.filter(ImageFilter.SHARPEN)
    return img


def extract_text_ocr(image_path: str) -> str:
    try:
        import pytesseract
    except ImportError:
        logger.warning("pytesseract not installed, OCR unavailable")
        return ""

    img = preprocess_image(image_path)
    try:
        text = pytesseract.image_to_string(img, lang="eng")
        return text.strip()
    except Exception as exc:
        logger.error("OCR extraction failed: %s", exc)
        return ""


def extract_structured_data(ocr_text: str) -> dict[str, Any]:
    if not is_configured():
        logger.warning("OpenRouter not configured, returning raw OCR text only")
        return {"ocr_raw_text": ocr_text, "confidence": 0.0}

    messages = [
        {"role": "system", "content": "You are an invoice data extraction assistant. Return only valid JSON."},
        {"role": "user", "content": EXTRACTION_PROMPT + ocr_text},
    ]
    try:
        result = chat_json(messages)
        return result
    except OpenRouterError as exc:
        logger.error("LLM extraction failed: %s", exc)
        return {"ocr_raw_text": ocr_text, "confidence": 0.0}


def process_invoice_image(image_path: str) -> dict[str, Any]:
    start = time.perf_counter()

    if not Path(image_path).exists():
        return {"error": "Image file not found", "confidence": 0.0}

    ocr_text = extract_text_ocr(image_path)
    if not ocr_text:
        return {"error": "Could not extract text from image", "confidence": 0.0}

    result = extract_structured_data(ocr_text)
    result["ocr_raw_text"] = ocr_text
    result["processing_time_ms"] = int((time.perf_counter() - start) * 1000)

    return result
