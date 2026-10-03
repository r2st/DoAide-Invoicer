from __future__ import annotations

import csv
import io
import json
from typing import Any

from openpyxl import Workbook
from sqlalchemy.orm import Session

from app.models.invoice import Invoice


def export_invoices_csv(invoices: list[Invoice]) -> str:
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Invoice Number", "Invoice Date", "Vendor Name", "Vendor GSTIN",
        "Buyer Name", "Buyer GSTIN", "Subtotal", "CGST", "SGST", "IGST",
        "Total", "Status",
    ])
    for inv in invoices:
        writer.writerow([
            inv.invoice_number, inv.invoice_date, inv.vendor_name,
            inv.vendor_gstin, inv.buyer_name, inv.buyer_gstin,
            inv.subtotal, inv.cgst, inv.sgst, inv.igst, inv.total,
            inv.status,
        ])
    return output.getvalue()


def export_invoices_excel(invoices: list[Invoice]) -> bytes:
    wb = Workbook()
    ws = wb.active
    ws.title = "Invoices"
    ws.append([
        "Invoice Number", "Invoice Date", "Vendor Name", "Vendor GSTIN",
        "Buyer Name", "Buyer GSTIN", "Subtotal", "CGST", "SGST", "IGST",
        "Total", "Status",
    ])
    for inv in invoices:
        ws.append([
            inv.invoice_number,
            str(inv.invoice_date) if inv.invoice_date else None,
            inv.vendor_name, inv.vendor_gstin, inv.buyer_name,
            inv.buyer_gstin,
            float(inv.subtotal) if inv.subtotal else None,
            float(inv.cgst) if inv.cgst else None,
            float(inv.sgst) if inv.sgst else None,
            float(inv.igst) if inv.igst else None,
            float(inv.total) if inv.total else None,
            inv.status,
        ])
    buffer = io.BytesIO()
    wb.save(buffer)
    return buffer.getvalue()


def export_gst_format(invoices: list[Invoice], period: str) -> dict[str, Any]:
    gst_invoices = []
    for inv in invoices:
        if inv.status != "approved":
            continue
        items = []
        for item in inv.items:
            items.append({
                "hsn": item.hsn_code,
                "taxable_value": float(item.taxable_amount) if item.taxable_amount else 0,
                "cgst": float(item.cgst) if item.cgst else 0,
                "sgst": float(item.sgst) if item.sgst else 0,
                "igst": float(item.igst) if item.igst else 0,
            })
        gst_invoices.append({
            "type": "B2B",
            "vendor_gstin": inv.vendor_gstin,
            "invoice_number": inv.invoice_number,
            "invoice_date": str(inv.invoice_date) if inv.invoice_date else None,
            "total_value": float(inv.total) if inv.total else 0,
            "items": items,
        })

    return {
        "period": period,
        "invoices": gst_invoices,
    }
