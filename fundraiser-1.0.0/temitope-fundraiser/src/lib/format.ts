export function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function calcPercent(raised: number, goal: number): number {
  return Math.min(100, Math.round((raised / goal) * 100));
}

export function generateTxRef(): string {
  return `TEMI-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}
