from __future__ import annotations

import logging
import os
import uuid
from typing import Any

import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)


def download_media(media_url: str) -> str | None:
    if not settings.twilio_account_sid or not settings.twilio_auth_token:
        logger.warning("Twilio credentials not configured")
        return None

    try:
        response = httpx.get(
            media_url,
            auth=(settings.twilio_account_sid, settings.twilio_auth_token),
            follow_redirects=True,
            timeout=30,
        )
        response.raise_for_status()
    except httpx.HTTPError as exc:
        logger.error("Failed to download media: %s", exc)
        return None

    os.makedirs(settings.upload_dir, exist_ok=True)
    filename = f"{uuid.uuid4().hex}.jpg"
    filepath = os.path.join(settings.upload_dir, filename)
    with open(filepath, "wb") as f:
        f.write(response.content)

    return filepath


def send_whatsapp_message(to: str, body: str) -> bool:
    if not settings.twilio_account_sid or not settings.twilio_auth_token:
        logger.warning("Twilio credentials not configured, message not sent")
        return False

    url = (
        f"https://api.twilio.com/2010-04-01/Accounts/"
        f"{settings.twilio_account_sid}/Messages.json"
    )
    try:
        response = httpx.post(
            url,
            auth=(settings.twilio_account_sid, settings.twilio_auth_token),
            data={
                "From": f"whatsapp:{settings.twilio_whatsapp_number}",
                "To": f"whatsapp:{to}",
                "Body": body,
            },
            timeout=15,
        )
        response.raise_for_status()
        return True
    except httpx.HTTPError as exc:
        logger.error("Failed to send WhatsApp message: %s", exc)
        return False


def format_invoice_response(data: dict[str, Any]) -> str:
    lines = ["Invoice extracted!\n"]

    if data.get("vendor_name"):
        lines.append(f"Vendor: {data['vendor_name']}")
    if data.get("vendor_gstin"):
        lines.append(f"GSTIN: {data['vendor_gstin']}")
    if data.get("invoice_number"):
        lines.append(f"Invoice #: {data['invoice_number']}")
    if data.get("invoice_date"):
        lines.append(f"Date: {data['invoice_date']}")

    items = data.get("line_items", [])
    if items:
        lines.append("\nItems:")
        for i, item in enumerate(items, 1):
            desc = item.get("description", "Unknown")
            amount = item.get("amount", 0)
            lines.append(f"{i}. {desc} - Rs.{amount}")

    if data.get("subtotal"):
        lines.append(f"\nSubtotal: Rs.{data['subtotal']}")
    if data.get("cgst"):
        lines.append(f"CGST: Rs.{data['cgst']}")
    if data.get("sgst"):
        lines.append(f"SGST: Rs.{data['sgst']}")
    if data.get("igst"):
        lines.append(f"IGST: Rs.{data['igst']}")
    if data.get("total"):
        lines.append(f"Total: Rs.{data['total']}")

    lines.append("\nReply 'ok' to approve, 'edit' to fix on dashboard, 'redo' to reprocess")

    return "\n".join(lines)
