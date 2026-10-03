from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class RegisterRequest(BaseModel):
    phone: str = Field(min_length=10, max_length=15)
    email: str | None = None
    password: str = Field(min_length=8, max_length=128)
    name: str | None = None
    gstin: str | None = Field(default=None, max_length=15)
    state_code: str | None = Field(default=None, max_length=2)


class LoginRequest(BaseModel):
    phone: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    phone: str
    email: str | None = None
    name: str | None = None
    plan: str
    gstin: str | None = None
    state_code: str | None = None
    is_active: bool
    created_at: datetime


class RegisterResponse(BaseModel):
    user: UserOut
    access_token: str
    token_type: str = "bearer"
