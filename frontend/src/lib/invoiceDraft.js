// Remembers the seller's own details on this device so a repeat invoice
// takes seconds without an account. Client details are never stored.

export const BUSINESS_KEY = "doaide_invoicer_business";

const EMPTY_FROM = { name: "", email: "", phone: "", address: "", gstin: "" };
const EMPTY_BANK = { name: "", account: "", ifsc: "" };

export function loadSavedBusiness(storage = globalThis.localStorage) {
  try {
    const raw = storage?.getItem(BUSINESS_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return {
      from: { ...EMPTY_FROM, ...(data.from || {}) },
      bank: { ...EMPTY_BANK, ...(data.bank || {}) },
    };
  } catch {
    return null;
  }
}

export function saveBusiness(from, bank, storage = globalThis.localStorage) {
  try {
    const hasAnything = [...Object.values(from || {}), ...Object.values(bank || {})].some((v) => String(v || "").trim());
    if (!hasAnything) return false;
    storage?.setItem(BUSINESS_KEY, JSON.stringify({ from, bank }));
    return true;
  } catch {
    return false;
  }
}

export function clearSavedBusiness(storage = globalThis.localStorage) {
  try {
    storage?.removeItem(BUSINESS_KEY);
  } catch {
    // Storage blocked; nothing was saved anyway.
  }
}
