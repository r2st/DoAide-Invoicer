from decimal import Decimal

from app.services.gst_calculator import calculate_gst, calculate_item_gst


def test_intra_state_gst():
    result = calculate_gst(10000, 18, "27", "27")
    assert result["cgst"] == Decimal("900.00")
    assert result["sgst"] == Decimal("900.00")
    assert result["igst"] == Decimal("0.00")
    assert result["total_tax"] == Decimal("1800.00")


def test_inter_state_gst():
    result = calculate_gst(10000, 18, "27", "29")
    assert result["cgst"] == Decimal("0.00")
    assert result["sgst"] == Decimal("0.00")
    assert result["igst"] == Decimal("1800.00")
    assert result["total_tax"] == Decimal("1800.00")


def test_zero_rate():
    result = calculate_gst(10000, 0, "27", "27")
    assert result["total_tax"] == Decimal("0.00")


def test_five_percent_gst():
    result = calculate_gst(10000, 5, "27", "27")
    assert result["cgst"] == Decimal("250.00")
    assert result["sgst"] == Decimal("250.00")


def test_twelve_percent_gst():
    result = calculate_gst(10000, 12, "27", "29")
    assert result["igst"] == Decimal("1200.00")


def test_twentyeight_percent_gst():
    result = calculate_gst(10000, 28, "27", "27")
    assert result["cgst"] == Decimal("1400.00")
    assert result["sgst"] == Decimal("1400.00")


def test_null_state_codes():
    result = calculate_gst(10000, 18, None, None)
    assert result["igst"] == Decimal("1800.00")


def test_item_gst_calculation():
    result = calculate_item_gst(10, 1000, 18, "27", "27")
    assert result["taxable_amount"] == Decimal("10000.00")
    assert result["cgst"] == Decimal("900.00")
    assert result["sgst"] == Decimal("900.00")
    assert result["total"] == Decimal("11800.00")


def test_item_gst_null_quantity():
    result = calculate_item_gst(None, 1000, 18, "27", "27")
    assert result["total"] == Decimal("0.00")
