import { act, renderHook } from "@testing-library/react";
import { ThemeProvider, useTheme } from "./useTheme";

function wrapper({ children }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

describe("useTheme", () => {
  it("defaults to system", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.theme).toBe("system");
  });

  it("sets theme and persists to localStorage", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    act(() => result.current.setTheme("dark"));
    expect(result.current.theme).toBe("dark");
    expect(localStorage.getItem("doaide-theme")).toBe("dark");
  });

  it("rejects invalid values", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    act(() => result.current.setTheme("invalid"));
    expect(result.current.theme).toBe("system");
  });
});
