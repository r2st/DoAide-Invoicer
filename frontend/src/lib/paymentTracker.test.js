import { describe, expect, it, beforeEach } from "vitest";
import { loadPayments, savePayment, updatePayment, deletePayment, getPaymentStats } from "./paymentTracker";

function fakeStorage() {
  const store = {};
  return {
    getItem: (k) => store[k] ?? null,
    setItem: (k, v) => { store[k] = v; },
    removeItem: (k) => { delete store[k]; },
  };
}

describe("paymentTracker", () => {
  let storage;
  beforeEach(() => { storage = fakeStorage(); });

  it("returns empty array when no payments saved", () => {
    expect(loadPayments(storage)).toEqual([]);
  });

  it("saves and loads a payment", () => {
    const p = savePayment({ invoiceNum: "INV-001", clientName: "Acme", amount: 5000, status: "pending" }, storage);
    expect(p.id).toBeTruthy();
    expect(p.amount).toBe(5000);
    const all = loadPayments(storage);
    expect(all).toHaveLength(1);
    expect(all[0].invoiceNum).toBe("INV-001");
  });

  it("updates a payment", () => {
    const p = savePayment({ invoiceNum: "INV-002", clientName: "Beta", amount: 10000, status: "pending" }, storage);
    const updated = updatePayment(p.id, { status: "paid", paidDate: "2026-10-20" }, storage);
    expect(updated.status).toBe("paid");
    expect(updated.paidDate).toBe("2026-10-20");
  });

  it("returns null when updating unknown id", () => {
    expect(updatePayment("nope", { status: "paid" }, storage)).toBeNull();
  });

  it("deletes a payment", () => {
    const p1 = savePayment({ invoiceNum: "A", amount: 100, status: "paid" }, storage);
    const p2 = savePayment({ invoiceNum: "B", amount: 200, status: "pending" }, storage);
    expect(p1.id).not.toBe(p2.id);
    deletePayment(p1.id, storage);
    const remaining = loadPayments(storage);
    expect(remaining).toHaveLength(1);
    expect(remaining[0].invoiceNum).toBe("B");
  });

  it("calculates stats correctly", () => {
    savePayment({ amount: 5000, status: "paid", paidDate: new Date().toISOString() }, storage);
    savePayment({ amount: 3000, status: "pending" }, storage);
    savePayment({ amount: 2000, status: "overdue" }, storage);
    const stats = getPaymentStats(storage);
    expect(stats.totalCollected).toBe(5000);
    expect(stats.totalOutstanding).toBe(5000);
    expect(stats.overdueCount).toBe(1);
    expect(stats.total).toBe(3);
  });

  it("handles corrupted storage gracefully", () => {
    storage.setItem("doaide_invoicer_payments", "broken");
    expect(loadPayments(storage)).toEqual([]);
  });
});
