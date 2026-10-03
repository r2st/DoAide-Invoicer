from __future__ import annotations

from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.invoice import Invoice
from app.models.user import User
from app.services.export_service import (
    export_gst_format,
    export_invoices_csv,
    export_invoices_excel,
)

router = APIRouter(prefix="/invoices", tags=["export"])


@router.get("/export")
def export_invoices(
    format: str = Query(default="csv", pattern="^(csv|excel|gst)$"),
    period: str | None = None,
    status_filter: str | None = Query(default=None, alias="status"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Response:
    query = select(Invoice).where(Invoice.user_id == current_user.id)
    if status_filter:
        query = query.where(Invoice.status == status_filter)
    invoices = db.scalars(query.order_by(Invoice.created_at.desc())).all()

    if format == "csv":
        csv_data = export_invoices_csv(list(invoices))
        return Response(
            content=csv_data,
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=invoices.csv"},
        )
    elif format == "excel":
        excel_data = export_invoices_excel(list(invoices))
        return Response(
            content=excel_data,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": "attachment; filename=invoices.xlsx"},
        )
    else:
        gst_data = export_gst_format(list(invoices), period or "")
        import json
        return Response(
            content=json.dumps(gst_data, indent=2),
            media_type="application/json",
            headers={"Content-Disposition": "attachment; filename=gst_export.json"},
        )
