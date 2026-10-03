from __future__ import annotations

import logging

from fastapi import APIRouter, Depends, Form, Query, Request, Response
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.invoice import Invoice
from app.models.user import User
from app.services.ocr_pipeline import process_invoice_image
from app.services.usage_service import check_quota, increment_usage
from app.services.whatsapp_handler import (
    download_media,
    format_invoice_response,
    send_whatsapp_message,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/whatsapp", tags=["whatsapp"])


@router.get("/webhook")
def verify_webhook(
    hub_mode: str | None = Query(default=None, alias="hub.mode"),
    hub_challenge: str | None = Query(default=None, alias="hub.challenge"),
    hub_verify_token: str | None = Query(default=None, alias="hub.verify_token"),
) -> Response:
    if hub_challenge:
        return Response(content=hub_challenge, media_type="text/plain")
    return Response(content="OK", media_type="text/plain")


@router.post("/webhook")
def receive_webhook(
    request: Request,
    db: Session = Depends(get_db),
    From: str = Form(default=""),
    Body: str = Form(default=""),
    NumMedia: str = Form(default="0"),
    MediaUrl0: str | None = Form(default=None),
    MediaContentType0: str | None = Form(default=None),
) -> Response:
    phone = From.replace("whatsapp:", "").strip()
    if not phone:
        return Response(content="OK", media_type="text/plain")

    user = db.scalar(select(User).where(User.phone == phone))
    if not user:
        user = User(phone=phone, plan="free")
        db.add(user)
        db.commit()
        db.refresh(user)
        send_whatsapp_message(
            phone,
            "Welcome to DoAide Invoicer!\n"
            "Send me a photo of any invoice and I'll extract all the data for you.\n\n"
            "Commands:\n"
            "- Send a photo -> Process invoice\n"
            "- 'status' -> Check processing status\n"
            "- 'help' -> Show commands",
        )
        return Response(content="OK", media_type="text/plain")

    body_lower = Body.strip().lower()

    if body_lower == "help":
        send_whatsapp_message(
            phone,
            "DoAide Invoicer Commands:\n"
            "- Send a photo -> Process invoice\n"
            "- 'status' -> Check recent invoices\n"
            "- 'help' -> Show this message",
        )
        return Response(content="OK", media_type="text/plain")

    if body_lower == "status":
        recent = db.scalars(
            select(Invoice)
            .where(Invoice.user_id == user.id)
            .order_by(Invoice.created_at.desc())
            .limit(5)
        ).all()
        if not recent:
            send_whatsapp_message(phone, "No invoices processed yet. Send a photo to get started!")
        else:
            lines = ["Recent invoices:"]
            for inv in recent:
                lines.append(f"- {inv.invoice_number or 'Unknown'} ({inv.status})")
            send_whatsapp_message(phone, "\n".join(lines))
        return Response(content="OK", media_type="text/plain")

    if int(NumMedia) > 0 and MediaUrl0:
        allowed, used, limit = check_quota(db, user.id, user.plan)
        if not allowed:
            send_whatsapp_message(
                phone,
                f"You've used all {limit} free invoices this month. "
                "Upgrade to Pro at invoicer.doaide.com/pricing",
            )
            return Response(content="OK", media_type="text/plain")

        send_whatsapp_message(phone, "Processing your invoice...")

        filepath = download_media(MediaUrl0)
        if not filepath:
            send_whatsapp_message(phone, "Failed to download image. Please try again.")
            return Response(content="OK", media_type="text/plain")

        invoice = Invoice(
            user_id=user.id,
            status="processing",
            source="whatsapp",
            image_path=filepath,
        )
        db.add(invoice)
        db.flush()

        result = process_invoice_image(filepath)

        from app.routers.invoices import _apply_extraction
        _apply_extraction(invoice, result, db)

        increment_usage(db, user.id)
        db.commit()
        db.refresh(invoice)

        if invoice.status == "failed":
            send_whatsapp_message(
                phone,
                "I couldn't read this clearly. Try taking the photo in better lighting "
                "with the invoice flat on a surface.",
            )
        else:
            response_text = format_invoice_response(result)
            send_whatsapp_message(phone, response_text)

        return Response(content="OK", media_type="text/plain")

    send_whatsapp_message(phone, "Send me a photo of an invoice to process it!")
    return Response(content="OK", media_type="text/plain")
