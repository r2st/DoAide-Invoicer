export function rupees(value, { decimals = 2 } = {}) {
  const number = Number(value ?? 0);
  if (!Number.isFinite(number)) return "₹0.00";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
}

export function rupeesShort(value) {
  const number = Number(value ?? 0);
  if (!Number.isFinite(number)) return "₹0";
  const abs = Math.abs(number);
  if (abs >= 1e7) return `₹${(number / 1e7).toFixed(2)}Cr`;
  if (abs >= 1e5) return `₹${(number / 1e5).toFixed(2)}L`;
  if (abs >= 1e3) return `₹${(number / 1e3).toFixed(1)}K`;
  return `₹${number.toFixed(0)}`;
}

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

function toLocalDate(value) {
  if (value instanceof Date) return value;
  const match = DATE_ONLY.exec(String(value));
  if (match) return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return new Date(value);
}

export function dateLabel(value) {
  if (!value) return "—";
  const date = toLocalDate(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function timeAgo(value) {
  if (!value) return "";
  const date = toLocalDate(value);
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const STATUS_LABELS = {
  processing: "Processing",
  extracted: "Extracted",
  approved: "Approved",
  rejected: "Rejected",
};

export function statusLabel(status) {
  return STATUS_LABELS[status] ?? status ?? "";
}

export function statusTone(status) {
  if (status === "approved") return "good";
  if (status === "extracted") return "warn";
  if (status === "rejected" || status === "failed") return "bad";
  return "neutral";
}
