from __future__ import annotations

from pydantic import BaseModel, ConfigDict


class HSNCodeOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    code: str
    description: str
    gst_rate: float
    category: str | None = None
