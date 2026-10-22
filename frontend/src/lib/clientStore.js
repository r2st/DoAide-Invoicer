const STORAGE_KEY = "doaide_invoicer_clients";
let _seq = 0;

export function loadClients(storage = globalThis.localStorage) {
  try {
    return JSON.parse(storage?.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function persist(clients, storage = globalThis.localStorage) {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(clients));
  } catch { /* storage full or blocked */ }
}

export function saveClient(client, storage = globalThis.localStorage) {
  const clients = loadClients(storage);
  const existing = clients.findIndex((c) => c.id === client.id);
  const entry = {
    ...client,
    id: client.id || `${Date.now().toString(36)}_${++_seq}`,
    createdAt: existing >= 0 ? clients[existing].createdAt : new Date().toISOString(),
  };
  if (existing >= 0) {
    clients[existing] = entry;
  } else {
    clients.push(entry);
  }
  persist(clients, storage);
  return entry;
}

export function deleteClient(id, storage = globalThis.localStorage) {
  const clients = loadClients(storage).filter((c) => c.id !== id);
  persist(clients, storage);
  return clients;
}

export function getClient(id, storage = globalThis.localStorage) {
  return loadClients(storage).find((c) => c.id === id) || null;
}
