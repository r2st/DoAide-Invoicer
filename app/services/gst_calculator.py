from __future__ import annotations

from decimal import ROUND_HALF_UP, Decimal


def calculate_gst(
    taxable_amount: float | Decimal,
    gst_rate: float | Decimal,
    vendor_state_code: str | None,
    buyer_state_code: str | None,
) -> dict[str, Decimal]:
    amount = Decimal(str(taxable_amount))
    rate = Decimal(str(gst_rate))
    tax = (amount * rate / Decimal("100")).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

    if vendor_state_code and buyer_state_code and vendor_state_code == buyer_state_code:
        half = (tax / Decimal("2")).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
        return {
            "cgst": half,
            "sgst": half,
            "igst": Decimal("0.00"),
            "total_tax": tax,
        }
    else:
        return {
            "cgst": Decimal("0.00"),
            "sgst": Decimal("0.00"),
            "igst": tax,
            "total_tax": tax,
        }


def calculate_item_gst(
    quantity: float | Decimal | None,
    unit_price: float | Decimal | None,
    gst_rate: float | Decimal,
    vendor_state_code: str | None,
    buyer_state_code: str | None,
) -> dict[str, Decimal]:
    if quantity is None or unit_price is None:
        return {
            "taxable_amount": Decimal("0.00"),
            "cgst": Decimal("0.00"),
            "sgst": Decimal("0.00"),
            "igst": Decimal("0.00"),
            "total": Decimal("0.00"),
        }

    taxable = (Decimal(str(quantity)) * Decimal(str(unit_price))).quantize(
        Decimal("0.01"), rounding=ROUND_HALF_UP
    )
    gst = calculate_gst(taxable, gst_rate, vendor_state_code, buyer_state_code)

    return {
        "taxable_amount": taxable,
        "cgst": gst["cgst"],
        "sgst": gst["sgst"],
        "igst": gst["igst"],
        "total": taxable + gst["total_tax"],
    }
