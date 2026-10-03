from __future__ import annotations

from sqlalchemy import Float, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.mixins import Money


class InvoiceItem(Base):
    __tablename__ = "invoice_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    invoice_id: Mapped[int] = mapped_column(
        ForeignKey("invoices.id", ondelete="CASCADE"), nullable=False, index=True
    )
    description: Mapped[str] = mapped_column(Text, nullable=False)
    hsn_code: Mapped[str | None] = mapped_column(String(8), nullable=True)
    quantity: Mapped[float | None] = mapped_column(Money, nullable=True)
    unit: Mapped[str | None] = mapped_column(String(20), nullable=True)
    unit_price: Mapped[float | None] = mapped_column(Money, nullable=True)
    tax_rate: Mapped[float | None] = mapped_column(Money, nullable=True)
    taxable_amount: Mapped[float | None] = mapped_column(Money, nullable=True)
    cgst: Mapped[float | None] = mapped_column(Money, nullable=True)
    sgst: Mapped[float | None] = mapped_column(Money, nullable=True)
    igst: Mapped[float | None] = mapped_column(Money, nullable=True)
    total: Mapped[float | None] = mapped_column(Money, nullable=True)
    confidence_score: Mapped[float | None] = mapped_column(Float, nullable=True)

    invoice: Mapped["Invoice"] = relationship("Invoice", back_populates="items")


from app.models.invoice import Invoice  # noqa: E402, F401
