const BASE = "/api";
const TOKEN_KEY = "invoicer_token";

const fallbackStore = new Map();

function readStored(key) {
  if (fallbackStore.has(key)) return fallbackStore.get(key);
  try { return localStorage.getItem(key); } catch { return null; }
}

function writeStored(key, value) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
    fallbackStore.delete(key);
  } catch {
    fallbackStore.set(key, value);
  }
}

export function getToken() { return readStored(TOKEN_KEY); }
export function setToken(token) { writeStored(TOKEN_KEY, token || null); }

const unauthorizedListeners = new Set();
export function onUnauthorized(listener) {
  unauthorizedListeners.add(listener);
  return () => unauthorizedListeners.delete(listener);
}

function tokenRejected() {
  setToken(null);
  for (const listener of unauthorizedListeners) {
    try { listener(); } catch { /* side channel */ }
  }
}

async function request(path, { method = "GET", body, form, auth = true, signal } = {}) {
  const headers = {};
  const token = getToken();
  if (auth && token) headers["Authorization"] = `Bearer ${token}`;

  let payload;
  if (form) {
    payload = form;
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  const res = await send(`${BASE}${path}`, { method, headers, body: payload, signal });
  if (res.status === 401 && auth && token) tokenRejected();
  if (res.status === 204) return null;

  const text = await res.text();
  const { data, readable } = readBody(text);

  if (!res.ok) {
    throw refusal(readable ? errorMessage(data, statusMessage(res)) : statusMessage(res), res);
  }
  if (!readable) throw new Error(`The server sent a response this app could not read (${res.status}).`);
  return data;
}

function refusal(message, res) {
  const err = new Error(message);
  err.status = res.status;
  return err;
}

function readBody(text) {
  if (!text) return { data: null, readable: true };
  try { return { data: JSON.parse(text), readable: true }; }
  catch { return { data: null, readable: false }; }
}

function statusMessage(res) {
  if (res.status >= 500) return `The server is having trouble (${res.status}). Please try again in a moment.`;
  if (res.status === 429) return `Too many requests (${res.status}). Please wait a moment and try again.`;
  if (res.status === 401) return `Your session has expired (${res.status}). Please sign in again.`;
  if (res.status === 403) return `You do not have access to this (${res.status}).`;
  if (res.status === 404) return `That is not here (${res.status}). It may have been deleted.`;
  if (res.status === 413) return `That file is too large to upload (${res.status}). Try a smaller one.`;
  return `Request failed (${res.status}).`;
}

async function send(input, init) {
  try { return await fetch(input, init); }
  catch (err) {
    if (isAbortError(err)) throw err;
    const offline = typeof navigator !== "undefined" && navigator.onLine === false;
    const failure = new Error(
      offline
        ? "You appear to be offline. Reconnect and try again."
        : "Could not reach the server. Check your connection, or try again in a moment.",
    );
    failure.cause = err;
    throw failure;
  }
}

export function isAbortError(err) { return err?.name === "AbortError"; }

export function errorMessage(data, fallback = "Request failed") {
  const detail = data?.detail ?? fallback;
  return flatten(detail).trim() || fallback;
}

function flatten(detail) {
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((d) => d.msg ?? JSON.stringify(d)).join(", ");
  if (detail && typeof detail === "object") return detail.message ?? JSON.stringify(detail);
  return String(detail);
}

function query(params = {}) {
  const search = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ""),
  );
  const suffix = search.toString();
  return suffix ? `?${suffix}` : "";
}

export const api = {
  async login(email, password) {
    const data = await request("/auth/otp/verify", { method: "POST", body: { phone: email, otp: password }, auth: false });
    setToken(data.access_token);
    return data;
  },

  async register(payload) {
    const data = await request("/auth/register", { method: "POST", body: payload, auth: false });
    setToken(data.access_token);
    return data;
  },

  logout() { setToken(null); },
  me: () => request("/auth/me"),

  listInvoices(params = {}, { signal } = {}) {
    return request(`/invoices${query(params)}`, { signal });
  },
  getInvoice: (id, { signal } = {}) => request(`/invoices/${id}`, { signal }),
  updateInvoice: (id, changes) => request(`/invoices/${id}`, { method: "PUT", body: changes }),
  approveInvoice: (id) => request(`/invoices/${id}/approve`, { method: "PATCH" }),
  rejectInvoice: (id) => request(`/invoices/${id}/reject`, { method: "PATCH" }),
  deleteInvoice: (id) => request(`/invoices/${id}`, { method: "DELETE" }),

  uploadInvoices(files) {
    const form = new FormData();
    for (const file of files) form.append("files", file);
    return request("/invoices/upload", { method: "POST", form });
  },

  exportInvoices(params = {}) {
    return request(`/invoices/export${query(params)}`);
  },

  stats: ({ signal } = {}) => request("/stats/overview", { signal }),
  trends: ({ signal } = {}) => request("/stats/trends", { signal }),
  vendors: ({ signal } = {}) => request("/stats/vendors", { signal }),

  searchHsn: (q, { signal } = {}) => request(`/hsn/search${query({ q })}`, { signal }),
  getHsn: (code) => request(`/hsn/${code}`),

  listClients: ({ signal } = {}) => request("/clients", { signal }),
  addClient: (payload) => request("/clients", { method: "POST", body: payload }),
  updateClient: (id, payload) => request(`/clients/${id}`, { method: "PUT", body: payload }),
  deleteClient: (id) => request(`/clients/${id}`, { method: "DELETE" }),

  subscriptionConfig: () => request("/subscriptions/config", { auth: false }),
  createSubscription: (plan) => request("/subscriptions/create", { method: "POST", body: { plan } }),
  verifySubscription: (payload) => request("/subscriptions/verify", { method: "POST", body: payload }),
  subscriptionStatus: () => request("/subscriptions/status"),
  cancelSubscription: () => request("/subscriptions/cancel", { method: "POST" }),
};
