from __future__ import annotations

from sqlalchemy import Date, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.mixins import TimestampMixin


class UsageTracking(Base, TimestampMixin):
    __tablename__ = "usage_tracking"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    month: Mapped[str] = mapped_column(Date, nullable=False)
    invoice_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
