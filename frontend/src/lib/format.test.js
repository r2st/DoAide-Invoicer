import { dateLabel, rupees, rupeesShort, statusLabel, statusTone, timeAgo } from "./format";

describe("rupees", () => {
  it("formats Indian currency", () => {
    expect(rupees(123456.78)).toMatch(/1,23,456.78/);
  });

  it("handles null/NaN", () => {
    expect(rupees(null)).toMatch(/0.00/);
    expect(rupees(NaN)).toMatch(/0.00/);
  });
});

describe("rupeesShort", () => {
  it("formats crores", () => {
    expect(rupeesShort(15000000)).toBe("₹1.50Cr");
  });

  it("formats lakhs", () => {
    expect(rupeesShort(250000)).toBe("₹2.50L");
  });

  it("formats thousands", () => {
    expect(rupeesShort(5000)).toBe("₹5.0K");
  });
});

describe("dateLabel", () => {
  it("formats a date string", () => {
    const result = dateLabel("2026-09-28");
    expect(result).toMatch(/28/);
    expect(result).toMatch(/Sep/);
    expect(result).toMatch(/2026/);
  });

  it("returns dash for empty", () => {
    expect(dateLabel(null)).toBe("—");
  });
});

describe("statusLabel", () => {
  it("returns label for known statuses", () => {
    expect(statusLabel("processing")).toBe("Processing");
    expect(statusLabel("approved")).toBe("Approved");
  });

  it("returns the raw value for unknown statuses", () => {
    expect(statusLabel("custom")).toBe("custom");
  });
});

describe("statusTone", () => {
  it("returns correct tones", () => {
    expect(statusTone("approved")).toBe("good");
    expect(statusTone("extracted")).toBe("warn");
    expect(statusTone("rejected")).toBe("bad");
    expect(statusTone("processing")).toBe("neutral");
  });
});

describe("timeAgo", () => {
  it("returns empty for falsy input", () => {
    expect(timeAgo(null)).toBe("");
  });
});
