from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.hsn import HSNCodeOut
from app.services.hsn_lookup import get_hsn_by_code, search_hsn

router = APIRouter(prefix="/hsn", tags=["hsn"])


@router.get("/search", response_model=list[HSNCodeOut])
def search_hsn_codes(
    q: str = Query(min_length=1),
    limit: int = Query(default=10, ge=1, le=50),
    db: Session = Depends(get_db),
) -> list[HSNCodeOut]:
    results = search_hsn(db, q, limit=limit)
    return [HSNCodeOut.model_validate(r) for r in results]


@router.get("/{code}", response_model=HSNCodeOut)
def get_hsn_code(code: str, db: Session = Depends(get_db)) -> HSNCodeOut:
    hsn = get_hsn_by_code(db, code)
    if not hsn:
        raise HTTPException(status_code=404, detail="HSN code not found")
    return HSNCodeOut.model_validate(hsn)
