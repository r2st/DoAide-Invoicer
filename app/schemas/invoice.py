from __future__ import annotations

from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field


class InvoiceItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    description: str
    hsn_code: str | None = None
    quantity: float | None = None
    unit: str | None = None
    unit_price: float | None = None
    tax_rate: float | None = None
    taxable_amount: float | None = None
    cgst: float | None = None
    sgst: float | None = None
    igst: float | None = None
    total: float | None = None
    confidence_score: float | None = None


class InvoiceOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    business_id: int | None = None
    status: str
    source: str
    image_path: str
    confidence_score: float | None = None

    vendor_name: str | None = None
    vendor_gstin: str | None = None
    vendor_address: str | None = None
    vendor_state_code: str | None = None
    buyer_name: str | None = None
    buyer_gstin: str | None = None
    buyer_state_code: str | None = None
    invoice_number: str | None = None
    invoice_date: date | None = None
    due_date: date | None = None

    subtotal: float | None = None
    cgst: float | None = None
    sgst: float | None = None
    igst: float | None = None
    total: float | None = None

    processing_time_ms: int | None = None
    extracted_at: datetime | None = None
    approved_at: datetime | None = None
    created_at: datetime
    updated_at: datetime

    items: list[InvoiceItemOut] = []


class InvoiceUpdate(BaseModel):
    vendor_name: str | None = None
    vendor_gstin: str | None = None
    vendor_address: str | None = None
    vendor_state_code: str | None = None
    buyer_name: str | None = None
    buyer_gstin: str | None = None
    buyer_state_code: str | None = None
    invoice_number: str | None = None
    invoice_date: date | None = None
    due_date: date | None = None
    subtotal: float | None = None
    cgst: float | None = None
    sgst: float | None = None
    igst: float | None = None
    total: float | None = None


class InvoiceItemCreate(BaseModel):
    description: str
    hsn_code: str | None = None
    quantity: float | None = None
    unit: str | None = None
    unit_price: float | None = None
    tax_rate: float | None = None


class InvoiceListResponse(BaseModel):
    invoices: list[InvoiceOut]
    total: int
    page: int
    per_page: int
