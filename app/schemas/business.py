from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class BusinessCreate(BaseModel):
    name: str = Field(max_length=255)
    gstin: str | None = Field(default=None, max_length=15)
    state_code: str | None = Field(default=None, max_length=2)
    phone: str | None = Field(default=None, max_length=15)


class BusinessUpdate(BaseModel):
    name: str | None = Field(default=None, max_length=255)
    gstin: str | None = Field(default=None, max_length=15)
    state_code: str | None = Field(default=None, max_length=2)
    phone: str | None = Field(default=None, max_length=15)


class BusinessOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    ca_user_id: int
    name: str
    gstin: str | None = None
    state_code: str | None = None
    phone: str | None = None
    created_at: datetime
