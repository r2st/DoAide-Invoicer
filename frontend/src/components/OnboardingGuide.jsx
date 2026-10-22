import { useEffect, useState } from "react";

export const ONBOARDING_KEY = "doaide_invoicer_onboarded";

const STEPS = [
  { title: "Add your business once", text: "Name, GSTIN and bank details are remembered on this device — no account needed." },
  { title: "Add the client and items", text: "Pick the GST rate per item; CGST + SGST (or IGST for inter-state) is worked out for you." },
  { title: "Send or download", text: "Send on WhatsApp with the full GST breakup, or download a PDF to print or email." },
];

function readSeen() {
  try {
    return window.localStorage.getItem(ONBOARDING_KEY) === "1";
  } catch {
    return false;
  }
}

function markSeen() {
  try {
    window.localStorage.setItem(ONBOARDING_KEY, "1");
  } catch {
    // Storage blocked: the guide simply shows again next visit.
  }
}

export default function OnboardingGuide() {
  const [open, setOpen] = useState(false);

  // Decide after mount so the prerendered page stays the same for everyone.
  useEffect(() => {
    if (!readSeen()) setOpen(true);
  }, []);

  function close() {
    markSeen();
    setOpen(false);
  }

  if (!open) {
    return (
      <div className="text-center mb-4">
        <button type="button" className="onboarding-reopen text-sm text-brand underline bg-transparent border-0 cursor-pointer" onClick={() => setOpen(true)}>
          How it works
        </button>
      </div>
    );
  }

  return (
    <section className="panel border-brand mb-6" aria-labelledby="onboarding-title">
      <div className="flex items-start justify-between gap-4">
        <h2 id="onboarding-title" className="font-display text-lg text-ink-strong mb-3">
          First invoice? 3 quick steps
        </h2>
        <button
          type="button"
          onClick={close}
          aria-label="Close guide"
          className="onboarding-close text-ink-soft text-2xl leading-none bg-transparent border-0 cursor-pointer"
        >
          ×
        </button>
      </div>
      <ol className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 list-none p-0">
        {STEPS.map((s, i) => (
          <li key={s.title} className="flex gap-3">
            <span aria-hidden="true" className="flex-shrink-0 w-7 h-7 rounded-full bg-brand text-white text-sm font-semibold inline-flex items-center justify-center">
              {i + 1}
            </span>
            <div>
              <strong className="text-sm text-ink-strong">{s.title}</strong>
              <p className="text-xs text-ink-soft mt-1 leading-relaxed">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <button type="button" className="btn btn-primary" onClick={close}>
        Got it, start my invoice
      </button>
    </section>
  );
}
