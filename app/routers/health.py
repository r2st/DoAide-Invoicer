from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import check_database, get_db

router = APIRouter(tags=["health"])


@router.get("/health")
def health(db: Session = Depends(get_db)) -> dict:
    db_ok, db_error = check_database(db)
    return {
        "status": "healthy" if db_ok else "degraded",
        "app": settings.app_name,
        "version": settings.app_version,
        "database": "connected" if db_ok else f"error: {db_error}",
    }


@router.get("/health/ready")
def readiness(db: Session = Depends(get_db)) -> dict:
    db_ok, _ = check_database(db)
    return {"ready": db_ok}
