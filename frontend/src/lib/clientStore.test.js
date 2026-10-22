import { describe, expect, it, beforeEach } from "vitest";
import { loadClients, saveClient, deleteClient, getClient } from "./clientStore";

function fakeStorage() {
  const store = {};
  return {
    getItem: (k) => store[k] ?? null,
    setItem: (k, v) => { store[k] = v; },
    removeItem: (k) => { delete store[k]; },
  };
}

describe("clientStore", () => {
  let storage;
  beforeEach(() => { storage = fakeStorage(); });

  it("returns empty array when no clients saved", () => {
    expect(loadClients(storage)).toEqual([]);
  });

  it("saves and loads a client", () => {
    const client = saveClient({ name: "Acme Corp", email: "a@acme.com", phone: "123", address: "Mumbai", gstin: "" }, storage);
    expect(client.id).toBeTruthy();
    expect(client.name).toBe("Acme Corp");
    const all = loadClients(storage);
    expect(all).toHaveLength(1);
    expect(all[0].name).toBe("Acme Corp");
  });

  it("updates existing client by id", () => {
    const c1 = saveClient({ name: "Acme" }, storage);
    saveClient({ ...c1, name: "Acme Updated" }, storage);
    const all = loadClients(storage);
    expect(all).toHaveLength(1);
    expect(all[0].name).toBe("Acme Updated");
  });

  it("deletes a client", () => {
    const c1 = saveClient({ name: "A" }, storage);
    const c2 = saveClient({ name: "B" }, storage);
    expect(c1.id).not.toBe(c2.id);
    deleteClient(c1.id, storage);
    const remaining = loadClients(storage);
    expect(remaining).toHaveLength(1);
    expect(remaining[0].name).toBe("B");
  });

  it("getClient returns the correct client", () => {
    const c1 = saveClient({ name: "X" }, storage);
    expect(getClient(c1.id, storage).name).toBe("X");
  });

  it("getClient returns null for unknown id", () => {
    expect(getClient("nope", storage)).toBeNull();
  });

  it("handles corrupted storage gracefully", () => {
    storage.setItem("doaide_invoicer_clients", "not json");
    expect(loadClients(storage)).toEqual([]);
  });
});
