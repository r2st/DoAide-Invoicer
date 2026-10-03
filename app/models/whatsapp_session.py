from __future__ import annotations

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.mixins import TimestampMixin


class WhatsAppSession(Base, TimestampMixin):
    __tablename__ = "whatsapp_sessions"

    id: Mapped[int] = mapped_column(primary_key=True)
    phone: Mapped[str] = mapped_column(String(15), nullable=False, index=True)
    user_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    state: Mapped[str] = mapped_column(String(30), default="idle", nullable=False)
    context: Mapped[str | None] = mapped_column(Text, nullable=True)
