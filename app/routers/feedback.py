from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

router = APIRouter(tags=["feedback"])

FEEDBACK_FILE = Path("data/feedback.json")
CATEGORIES = {"Bug", "Feature Request", "General"}


class FeedbackIn(BaseModel):
    category: str = Field(..., min_length=1)
    message: str = Field(..., min_length=1, max_length=2000)


@router.post("/feedback", status_code=201)
def submit_feedback(payload: FeedbackIn) -> dict:
    if payload.category not in CATEGORIES:
        raise HTTPException(status_code=422, detail="Invalid category")

    entry = {
        "category": payload.category,
        "message": payload.message,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

    FEEDBACK_FILE.parent.mkdir(parents=True, exist_ok=True)

    entries: list[dict] = []
    if FEEDBACK_FILE.exists():
        entries = json.loads(FEEDBACK_FILE.read_text())

    entries.append(entry)
    FEEDBACK_FILE.write_text(json.dumps(entries, indent=2))

    return {"status": "ok"}
