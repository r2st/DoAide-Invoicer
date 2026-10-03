import { errorMessage, getToken, isAbortError, setToken } from "./api";

describe("token management", () => {
  it("stores and retrieves a token", () => {
    setToken("abc123");
    expect(getToken()).toBe("abc123");
  });

  it("clears the token", () => {
    setToken("abc123");
    setToken(null);
    expect(getToken()).toBeNull();
  });
});

describe("errorMessage", () => {
  it("extracts string detail", () => {
    expect(errorMessage({ detail: "Bad request" })).toBe("Bad request");
  });

  it("flattens array detail", () => {
    expect(errorMessage({ detail: [{ msg: "field required" }] })).toBe("field required");
  });

  it("uses fallback for empty detail", () => {
    expect(errorMessage({ detail: "" }, "fallback")).toBe("fallback");
  });

  it("uses fallback for null data", () => {
    expect(errorMessage(null)).toBe("Request failed");
  });
});

describe("isAbortError", () => {
  it("detects abort errors", () => {
    const err = new DOMException("aborted", "AbortError");
    expect(isAbortError(err)).toBe(true);
  });

  it("rejects other errors", () => {
    expect(isAbortError(new Error("nope"))).toBe(false);
    expect(isAbortError(null)).toBe(false);
  });
});
