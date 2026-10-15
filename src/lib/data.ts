// Demo data for the Smart Home & Utility Management simulation.
export const USAGE = {
  electricity: { daily: 12.4, weekly: 82.5, monthly: 326, voltage: 220 },
  gas: { daily: 4.2, monthly: 34.8, pressure: 2.1 },
  water: { daily: 0.8, monthly: 18.6, flow: 6.4 },
};

export const RATES = { electricity: 0.15, gas: 0.85, water: 1.6 };

export const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

// Deterministic pseudo-random wave so charts are stable across renders.
const wave = (i: number, seed: number) =>
  (Math.sin(i * 1.7 + seed) + Math.sin(i * 0.6 + seed * 2)) / 2;

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const weeklyUsage = DAYS.map((d, i) => ({
  label: d,
  electricity: +(USAGE.electricity.daily + wave(i, 1) * 2.2).toFixed(1),
  gas: +(USAGE.gas.daily + wave(i, 2) * 0.9).toFixed(1),
  water: +(USAGE.water.daily + wave(i, 3) * 0.2).toFixed(2),
}));

export const hourlyUsage = Array.from({ length: 24 }, (_, h) => ({
  label: `${String(h).padStart(2, "0")}:00`,
  electricity: +(0.25 + Math.max(0, Math.sin(((h - 6) / 24) * Math.PI * 2)) * 0.6 + wave(h, 4) * 0.08).toFixed(2),
  gas: +(0.1 + (h > 6 && h < 9 ? 0.4 : h > 18 && h < 22 ? 0.5 : 0.08) + wave(h, 5) * 0.03).toFixed(2),
}));

export const monthlyExpenses = MONTHS.map((m, i) => ({
  label: m,
  electricity: +(48 + wave(i, 6) * 9).toFixed(2),
  gas: +(29 + wave(i, 7) * 10 + (i < 2 || i > 9 ? 12 : 0)).toFixed(2),
  water: +(18 + wave(i, 8) * 4).toFixed(2),
}));

export type Range = "7d" | "30d" | "3m" | "1y";

export function analyticsSeries(range: Range) {
  const cfg = {
    "7d": { n: 7, label: (i: number) => DAYS[i], k: 1 },
    "30d": { n: 30, label: (i: number) => `D${i + 1}`, k: 1 },
    "3m": { n: 12, label: (i: number) => `W${i + 1}`, k: 7 },
    "1y": { n: 12, label: (i: number) => MONTHS[i], k: 30 },
  }[range];
  return Array.from({ length: cfg.n }, (_, i) => ({
    label: cfg.label(i),
    electricity: +((USAGE.electricity.daily + wave(i, 1) * 2.2) * cfg.k).toFixed(1),
    gas: +((USAGE.gas.daily + wave(i, 2) * 0.9) * cfg.k).toFixed(1),
    water: +((USAGE.water.daily + wave(i, 3) * 0.2) * cfg.k).toFixed(2),
  }));
}

export type BillId = "electricity" | "gas" | "water" | "heating" | "internet" | "other";
export interface Bill {
  id: BillId;
  name: string;
  debt: number;
  due: string;
  status: "Pending" | "Overdue" | "Paid";
}

export const INITIAL_BILLS: Bill[] = [
  { id: "electricity", name: "Electricity", debt: 48.9, due: "2026-10-15", status: "Pending" },
  { id: "gas", name: "Gas", debt: 29.58, due: "2026-10-10", status: "Pending" },
  { id: "water", name: "Water", debt: 18.4, due: "2026-10-05", status: "Overdue" },
  { id: "heating", name: "Heating", debt: 34.2, due: "2026-10-20", status: "Pending" },
  { id: "internet", name: "Internet", debt: 25, due: "2026-10-25", status: "Pending" },
  { id: "other", name: "Other Utilities", debt: 0, due: "2026-10-30", status: "Paid" },
];

export interface Payment {
  id: string;
  billId: BillId;
  utility: string;
  amount: number;
  date: string;
}

export const INITIAL_PAYMENTS: Payment[] = [
  { id: "TX-84A2F19C", billId: "electricity", utility: "Electricity", amount: 52.3, date: "2026-09-14T10:12:00" },
  { id: "TX-71C0B33E", billId: "gas", utility: "Gas", amount: 41.75, date: "2026-09-10T18:40:00" },
  { id: "TX-55D9E021", billId: "water", utility: "Water", amount: 19.2, date: "2026-09-06T09:05:00" },
  { id: "TX-39F2A8B7", billId: "internet", utility: "Internet", amount: 25, date: "2026-09-01T12:00:00" },
];

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "danger";
  read: boolean;
  date: string;
}

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  { id: "n1", title: "High consumption", message: "Electricity consumption is higher than usual.", type: "warning", read: false, date: "2026-10-09T08:20:00" },
  { id: "n2", title: "Payment reminder", message: "Gas payment is due tomorrow.", type: "danger", read: false, date: "2026-10-09T07:00:00" },
  { id: "n3", title: "Water system", message: "Water system was turned off.", type: "info", read: false, date: "2026-10-08T21:14:00" },
  { id: "n4", title: "Report", message: "Monthly utility report is ready.", type: "success", read: true, date: "2026-10-01T09:00:00" },
];

export interface HistoryItem {
  id: string;
  text: string;
  date: string;
}

export const INITIAL_HISTORY: HistoryItem[] = [
  { id: "h1", text: "Water turned OFF", date: "2026-10-08T21:14:00" },
  { id: "h2", text: "Gas turned ON", date: "2026-10-08T07:02:00" },
  { id: "h3", text: "Electricity turned ON", date: "2026-10-07T18:30:00" },
];

export const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
