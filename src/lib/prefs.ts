import type { Prefs } from "./store";

export const NOTIF_PREFS: { key: keyof Prefs; label: string; desc: string }[] = [
  { key: "emailNotif", label: "Email notifications", desc: "Monthly reports and receipts by email" },
  { key: "systemNotif", label: "System notifications", desc: "Device status changes and alerts" },
  { key: "paymentNotif", label: "Payment notifications", desc: "Due dates and payment confirmations" },
];
