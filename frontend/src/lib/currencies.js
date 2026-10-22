export const CURRENCIES = [
  { code: "INR", symbol: "₹", name: "Indian Rupee", locale: "en-IN" },
  { code: "USD", symbol: "$", name: "US Dollar", locale: "en-US" },
  { code: "EUR", symbol: "€", name: "Euro", locale: "de-DE" },
  { code: "GBP", symbol: "£", name: "British Pound", locale: "en-GB" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham", locale: "ar-AE" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar", locale: "en-SG" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", locale: "en-AU" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", locale: "en-CA" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", locale: "ja-JP" },
];

export const DEFAULT_CURRENCY = "INR";

export function getCurrency(code) {
  return CURRENCIES.find((c) => c.code === code) || CURRENCIES[0];
}

export function formatCurrency(value, currencyCode = DEFAULT_CURRENCY, { decimals } = {}) {
  const number = Number(value ?? 0);
  if (!Number.isFinite(number)) return `${getCurrency(currencyCode).symbol}0`;
  const cur = getCurrency(currencyCode);
  const fractionDigits = decimals ?? (currencyCode === "JPY" ? 0 : 2);
  return new Intl.NumberFormat(cur.locale, {
    style: "currency",
    currency: cur.code,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(number);
}
