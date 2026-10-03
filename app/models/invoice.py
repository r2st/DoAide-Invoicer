from __future__ import annotations

from datetime import date, datetime

from sqlalchemy import Date, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.mixins import Money, TimestampMixin


class Invoice(Base, TimestampMixin):
    __tablename__ = "invoices"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    business_id: Mapped[int | None] = mapped_column(
        ForeignKey("businesses.id", ondelete="SET NULL"), nullable=True, index=True
    )
    status: Mapped[str] = mapped_column(
        String(20), default="processing", nullable=False, index=True
    )
    source: Mapped[str] = mapped_column(String(20), nullable=False)
    image_path: Mapped[str] = mapped_column(Text, nullable=False)
    ocr_raw_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    confidence_score: Mapped[float | None] = mapped_column(Float, nullable=True)

    vendor_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    vendor_gstin: Mapped[str | None] = mapped_column(String(15), nullable=True)
    vendor_address: Mapped[str | None] = mapped_column(Text, nullable=True)
    vendor_state_code: Mapped[str | None] = mapped_column(String(2), nullable=True)
    buyer_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    buyer_gstin: Mapped[str | None] = mapped_column(String(15), nullable=True)
    buyer_state_code: Mapped[str | None] = mapped_column(String(2), nullable=True)
    invoice_number: Mapped[str | None] = mapped_column(String(100), nullable=True)
    invoice_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    due_date: Mapped[date | None] = mapped_column(Date, nullable=True)

    subtotal: Mapped[float | None] = mapped_column(Money, nullable=True)
    cgst: Mapped[float | None] = mapped_column(Money, nullable=True)
    sgst: Mapped[float | None] = mapped_column(Money, nullable=True)
    igst: Mapped[float | None] = mapped_column(Money, nullable=True)
    total: Mapped[float | None] = mapped_column(Money, nullable=True)

    processing_time_ms: Mapped[int | None] = mapped_column(Integer, nullable=True)
    extracted_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    approved_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    items: Mapped[list["InvoiceItem"]] = relationship(
        "InvoiceItem", back_populates="invoice", cascade="all, delete-orphan"
    )


from app.models.invoice_item import InvoiceItem  # noqa: E402, F401
