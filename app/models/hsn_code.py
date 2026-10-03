from __future__ import annotations

from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.mixins import Money


class HSNCode(Base):
    __tablename__ = "hsn_codes"

    code: Mapped[str] = mapped_column(String(8), primary_key=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    gst_rate: Mapped[float] = mapped_column(Money, nullable=False)
    category: Mapped[str | None] = mapped_column(String(100), nullable=True)
    search_keywords: Mapped[str | None] = mapped_column(Text, nullable=True)
