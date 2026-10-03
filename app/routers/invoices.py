from __future__ import annotations

import logging
import os
import uuid

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile, status
from sqlalchemy import select, func
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.invoice import Invoice
from app.models.invoice_item import InvoiceItem
from app.models.mixins import utcnow
from app.models.user import User
from app.schemas.invoice import InvoiceListResponse, InvoiceOut, InvoiceUpdate
from app.services.gst_calculator import calculate_gst
from app.services.ocr_pipeline import process_invoice_image
from app.services.usage_service import check_quota, increment_usage

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/invoices", tags=["invoices"])


@router.get("", response_model=InvoiceListResponse)
def list_invoices(
    page: int = Query(default=1, ge=1),
    per_page: int = Query(default=20, ge=1, le=100),
    status_filter: str | None = Query(default=None, alias="status"),
    business_id: int | None = None,
    vendor_name: str | None = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> InvoiceListResponse:
    query = select(Invoice).where(Invoice.user_id == current_user.id)

    if status_filter:
        query = query.where(Invoice.status == status_filter)
    if business_id:
        query = query.where(Invoice.business_id == business_id)
    if vendor_name:
        query = query.where(Invoice.vendor_name.ilike(f"%{vendor_name}%"))

    total = db.scalar(
        select(func.count()).select_from(query.subquery())
    )
    invoices = db.scalars(
        query.order_by(Invoice.created_at.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
    ).all()

    return InvoiceListResponse(
        invoices=[InvoiceOut.model_validate(inv) for inv in invoices],
        total=total or 0,
        page=page,
        per_page=per_page,
    )


@router.get("/{invoice_id}", response_model=InvoiceOut)
def get_invoice(
    invoice_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> InvoiceOut:
    invoice = db.scalar(
        select(Invoice).where(
            Invoice.id == invoice_id, Invoice.user_id == current_user.id
        )
    )
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return InvoiceOut.model_validate(invoice)


@router.post("/upload", response_model=InvoiceOut, status_code=status.HTTP_201_CREATED)
def upload_invoice(
    file: UploadFile = File(...),
    business_id: int | None = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> InvoiceOut:
    allowed, used, limit = check_quota(db, current_user.id, current_user.plan)
    if not allowed:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Monthly quota exceeded ({used}/{limit}). Upgrade your plan.",
        )

    os.makedirs(settings.upload_dir, exist_ok=True)
    filename = f"{uuid.uuid4().hex}_{file.filename}"
    filepath = os.path.join(settings.upload_dir, filename)
    with open(filepath, "wb") as f:
        content = file.file.read()
        if len(content) > settings.max_upload_bytes:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File too large. Max {settings.max_upload_mb}MB.",
            )
        f.write(content)

    invoice = Invoice(
        user_id=current_user.id,
        business_id=business_id,
        status="processing",
        source="web_upload",
        image_path=filepath,
    )
    db.add(invoice)
    db.flush()

    result = process_invoice_image(filepath)
    _apply_extraction(invoice, result, db)

    increment_usage(db, current_user.id)
    db.commit()
    db.refresh(invoice)

    return InvoiceOut.model_validate(invoice)


def _apply_extraction(invoice: Invoice, data: dict, db: Session) -> None:
    invoice.ocr_raw_text = data.get("ocr_raw_text")
    invoice.confidence_score = data.get("confidence", 0.0)
    invoice.vendor_name = data.get("vendor_name")
    invoice.vendor_gstin = data.get("vendor_gstin")
    invoice.vendor_address = data.get("vendor_address")
    invoice.vendor_state_code = data.get("vendor_state_code")
    invoice.buyer_name = data.get("buyer_name")
    invoice.buyer_gstin = data.get("buyer_gstin")
    invoice.buyer_state_code = data.get("buyer_state_code")
    invoice.invoice_number = data.get("invoice_number")
    invoice.subtotal = data.get("subtotal")
    invoice.cgst = data.get("cgst")
    invoice.sgst = data.get("sgst")
    invoice.igst = data.get("igst")
    invoice.total = data.get("total")
    invoice.processing_time_ms = data.get("processing_time_ms")

    if data.get("invoice_date"):
        try:
            from datetime import date
            invoice.invoice_date = date.fromisoformat(data["invoice_date"])
        except (ValueError, TypeError):
            pass
    if data.get("due_date"):
        try:
            from datetime import date
            invoice.due_date = date.fromisoformat(data["due_date"])
        except (ValueError, TypeError):
            pass

    for item_data in data.get("line_items", []):
        item = InvoiceItem(
            invoice_id=invoice.id,
            description=item_data.get("description", "Unknown"),
            hsn_code=item_data.get("hsn_code"),
            quantity=item_data.get("quantity"),
            unit=item_data.get("unit"),
            unit_price=item_data.get("unit_price"),
            tax_rate=item_data.get("tax_rate"),
            taxable_amount=item_data.get("amount"),
        )
        db.add(item)

    invoice.extracted_at = utcnow()
    if data.get("error"):
        invoice.status = "failed"
    elif invoice.confidence_score and invoice.confidence_score > 0.5:
        invoice.status = "extracted"
    else:
        invoice.status = "review"


@router.put("/{invoice_id}", response_model=InvoiceOut)
def update_invoice(
    invoice_id: int,
    payload: InvoiceUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> InvoiceOut:
    invoice = db.scalar(
        select(Invoice).where(
            Invoice.id == invoice_id, Invoice.user_id == current_user.id
        )
    )
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(invoice, field, value)

    db.commit()
    db.refresh(invoice)
    return InvoiceOut.model_validate(invoice)


@router.patch("/{invoice_id}/approve", response_model=InvoiceOut)
def approve_invoice(
    invoice_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> InvoiceOut:
    invoice = db.scalar(
        select(Invoice).where(
            Invoice.id == invoice_id, Invoice.user_id == current_user.id
        )
    )
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    invoice.status = "approved"
    invoice.approved_at = utcnow()
    db.commit()
    db.refresh(invoice)
    return InvoiceOut.model_validate(invoice)


@router.patch("/{invoice_id}/reject", response_model=InvoiceOut)
def reject_invoice(
    invoice_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> InvoiceOut:
    invoice = db.scalar(
        select(Invoice).where(
            Invoice.id == invoice_id, Invoice.user_id == current_user.id
        )
    )
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    invoice.status = "rejected"
    db.commit()
    db.refresh(invoice)
    return InvoiceOut.model_validate(invoice)


@router.delete("/{invoice_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_invoice(
    invoice_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    invoice = db.scalar(
        select(Invoice).where(
            Invoice.id == invoice_id, Invoice.user_id == current_user.id
        )
    )
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    db.delete(invoice)
    db.commit()
