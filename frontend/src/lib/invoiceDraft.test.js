import { afterEach, describe, expect, it } from "vitest";
import { BUSINESS_KEY, clearSavedBusiness, loadSavedBusiness, saveBusiness } from "./invoiceDraft";

afterEach(() => window.localStorage.clear());

describe("invoiceDraft", () => {
  it("round-trips the seller's details and bank", () => {
    saveBusiness({ name: "Sharma Traders", gstin: "27AAAAA0000A1Z5" }, { ifsc: "SBIN0001234" });
    const saved = loadSavedBusiness();
    expect(saved.from.name).toBe("Sharma Traders");
    expect(saved.from.email).toBe("");
    expect(saved.bank.ifsc).toBe("SBIN0001234");
  });

  it("does not save an empty form", () => {
    expect(saveBusiness({ name: " " }, {})).toBe(false);
    expect(window.localStorage.getItem(BUSINESS_KEY)).toBeNull();
  });

  it("returns null for missing or corrupt data", () => {
    expect(loadSavedBusiness()).toBeNull();
    window.localStorage.setItem(BUSINESS_KEY, "{oops");
    expect(loadSavedBusiness()).toBeNull();
  });

  it("survives blocked storage", () => {
    const blocked = { getItem() { throw new Error("x"); }, setItem() { throw new Error("x"); }, removeItem() { throw new Error("x"); } };
    expect(loadSavedBusiness(blocked)).toBeNull();
    expect(saveBusiness({ name: "A" }, {}, blocked)).toBe(false);
    expect(() => clearSavedBusiness(blocked)).not.toThrow();
  });

  it("clears saved details", () => {
    saveBusiness({ name: "A" }, {});
    clearSavedBusiness();
    expect(loadSavedBusiness()).toBeNull();
  });
});
