from __future__ import annotations

from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.models.hsn_code import HSNCode


def search_hsn(db: Session, query: str, limit: int = 10) -> list[HSNCode]:
    q = query.strip().lower()
    if not q:
        return []

    if q.isdigit():
        results = (
            db.query(HSNCode)
            .filter(HSNCode.code.startswith(q))
            .limit(limit)
            .all()
        )
        if results:
            return results

    return (
        db.query(HSNCode)
        .filter(
            or_(
                HSNCode.description.ilike(f"%{q}%"),
                HSNCode.search_keywords.ilike(f"%{q}%"),
                HSNCode.category.ilike(f"%{q}%"),
            )
        )
        .limit(limit)
        .all()
    )


def get_hsn_by_code(db: Session, code: str) -> HSNCode | None:
    return db.get(HSNCode, code.strip())


def get_gst_rate_for_hsn(db: Session, code: str) -> float | None:
    hsn = get_hsn_by_code(db, code)
    if hsn:
        return float(hsn.gst_rate)
    return None
