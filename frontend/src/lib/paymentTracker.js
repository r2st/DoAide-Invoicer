const STORAGE_KEY = "doaide_invoicer_payments";
let _seq = 0;

export const PAYMENT_STATUSES = ["paid", "pending", "overdue"];

export function loadPayments(storage = globalThis.localStorage) {
  try {
    return JSON.parse(storage?.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function persist(payments, storage = globalThis.localStorage) {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(payments));
  } catch { /* storage full or blocked */ }
}

export function savePayment(payment, storage = globalThis.localStorage) {
  const payments = loadPayments(storage);
  const existing = payments.findIndex((p) => p.id === payment.id);
  const entry = {
    ...payment,
    id: payment.id || `${Date.now().toString(36)}_${++_seq}`,
    amount: Number(payment.amount) || 0,
    createdAt: existing >= 0 ? payments[existing].createdAt : new Date().toISOString(),
  };
  if (existing >= 0) {
    payments[existing] = entry;
  } else {
    payments.push(entry);
  }
  persist(payments, storage);
  return entry;
}

export function updatePayment(id, updates, storage = globalThis.localStorage) {
  const payments = loadPayments(storage);
  const idx = payments.findIndex((p) => p.id === id);
  if (idx < 0) return null;
  payments[idx] = { ...payments[idx], ...updates };
  persist(payments, storage);
  return payments[idx];
}

export function deletePayment(id, storage = globalThis.localStorage) {
  const payments = loadPayments(storage).filter((p) => p.id !== id);
  persist(payments, storage);
  return payments;
}

export function getPaymentStats(storage = globalThis.localStorage) {
  const payments = loadPayments(storage);
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  let totalOutstanding = 0;
  let overdueCount = 0;
  let paidThisMonth = 0;
  let totalCollected = 0;

  for (const p of payments) {
    if (p.status === "paid") {
      totalCollected += p.amount;
      if (p.paidDate && new Date(p.paidDate) >= monthStart) paidThisMonth += p.amount;
    } else {
      totalOutstanding += p.amount;
      if (p.status === "overdue") overdueCount++;
    }
  }

  return { totalOutstanding, overdueCount, paidThisMonth, totalCollected, total: payments.length };
}
