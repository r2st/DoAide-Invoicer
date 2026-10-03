import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

if (globalThis.localStorage === undefined) {
  const { JSDOM } = await import("jsdom");
  const donor = new JSDOM("", { url: "http://localhost" });
  for (const key of ["localStorage", "sessionStorage"]) {
    Object.defineProperty(globalThis, key, {
      value: donor.window[key],
      configurable: true,
      writable: true,
    });
  }
}

afterEach(() => {
  cleanup();
  localStorage.clear();
});
