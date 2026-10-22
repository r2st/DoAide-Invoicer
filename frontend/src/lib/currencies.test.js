import { describe, expect, it } from "vitest";
import { CURRENCIES, DEFAULT_CURRENCY, getCurrency, formatCurrency } from "./currencies";

describe("currencies", () => {
  it("has INR as default currency", () => {
    expect(DEFAULT_CURRENCY).toBe("INR");
  });

  it("contains at least 9 currencies", () => {
    expect(CURRENCIES.length).toBeGreaterThanOrEqual(9);
  });

  it("getCurrency returns the correct currency", () => {
    expect(getCurrency("USD").name).toBe("US Dollar");
    expect(getCurrency("EUR").symbol).toBe("€");
  });

  it("getCurrency falls back to INR for unknown code", () => {
    expect(getCurrency("XYZ").code).toBe("INR");
  });

  it("formatCurrency formats INR correctly", () => {
    const result = formatCurrency(1234.56, "INR");
    expect(result).toContain("1,234.56");
  });

  it("formatCurrency formats USD correctly", () => {
    const result = formatCurrency(1234.56, "USD");
    expect(result).toContain("1,234.56");
    expect(result).toContain("$");
  });

  it("formatCurrency formats EUR correctly", () => {
    const result = formatCurrency(1234.56, "EUR");
    expect(result).toMatch(/1[.,]234[.,]56/);
  });

  it("formatCurrency formats JPY with no decimals", () => {
    const result = formatCurrency(1234, "JPY");
    expect(result).toContain("1,234");
    expect(result).not.toContain(".00");
  });

  it("formatCurrency defaults to INR", () => {
    const result = formatCurrency(500);
    expect(result).toContain("500");
  });

  it("formatCurrency handles non-finite values", () => {
    expect(formatCurrency(NaN, "USD")).toContain("0");
    expect(formatCurrency(undefined, "USD")).toContain("0");
  });
});
