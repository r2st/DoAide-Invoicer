import { renderHook, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { AuthProvider, useAuth } from "./useAuth";
import * as apiModule from "../lib/api";

vi.mock("../lib/api", async () => {
  const actual = await vi.importActual("../lib/api");
  return {
    ...actual,
    getToken: vi.fn(() => null),
    setToken: vi.fn(),
    onUnauthorized: vi.fn(() => () => {}),
    api: {
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      me: vi.fn(),
    },
  };
});

function wrapper({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}

describe("useAuth", () => {
  it("starts loading then resolves to no user when no token", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user).toBeNull();
  });

  it("throws when used outside provider", () => {
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow("useAuth must be used within AuthProvider");
  });
});
