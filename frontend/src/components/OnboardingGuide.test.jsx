import { fireEvent, render, screen } from "@testing-library/react";
import OnboardingGuide, { ONBOARDING_KEY } from "./OnboardingGuide";

afterEach(() => {
  window.localStorage.clear();
  vi.restoreAllMocks();
});

describe("OnboardingGuide", () => {
  it("shows three steps to a first-time visitor", () => {
    render(<OnboardingGuide />);
    expect(screen.getByText("First invoice? 3 quick steps")).toBeInTheDocument();
    expect(screen.getByText("Add your business once")).toBeInTheDocument();
    expect(screen.getByText("Send or download")).toBeInTheDocument();
  });

  it("remembers dismissal and can be reopened", () => {
    render(<OnboardingGuide />);
    fireEvent.click(screen.getByText("Got it, start my invoice"));
    expect(window.localStorage.getItem(ONBOARDING_KEY)).toBe("1");
    expect(screen.queryByText("Add your business once")).not.toBeInTheDocument();
    fireEvent.click(screen.getByText("How it works"));
    expect(screen.getByText("Add your business once")).toBeInTheDocument();
  });

  it("stays closed for returning visitors", () => {
    window.localStorage.setItem(ONBOARDING_KEY, "1");
    render(<OnboardingGuide />);
    expect(screen.queryByText("Add your business once")).not.toBeInTheDocument();
  });

  it("still renders when storage throws", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    render(<OnboardingGuide />);
    expect(screen.getByText("Add your business once")).toBeInTheDocument();
  });
});
