/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        canvas: "var(--canvas)",
        surface: "var(--surface)",
        "surface-hover": "var(--surface-hover)",
        line: "var(--line)",
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
        "ink-strong": "var(--ink-strong)",
        "ink-muted": "var(--ink-muted)",
        brand: "var(--brand)",
        "brand-dark": "var(--brand-dark)",
        "brand-text": "var(--brand-text)",
        "brand-hover": "var(--brand-hover)",
        good: "var(--good)",
        warn: "var(--warn)",
        bad: "var(--bad)",
        "good-bg": "var(--good-bg)",
        "warn-bg": "var(--warn-bg)",
        "bad-bg": "var(--bad-bg)",
        whatsapp: "#25D366",
        "whatsapp-dark": "#128C7E",
      },
      fontFamily: {
        sans: ["Schibsted Grotesk", "system-ui", "-apple-system", "sans-serif"],
        display: ["Instrument Serif", "Georgia", "serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
      },
      boxShadow: {
        card: "var(--shadow)",
      },
    },
  },
  plugins: [],
};
