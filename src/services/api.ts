// Mock service layer. Replace these functions with real IoT / payment API calls later.
import type { DeviceKey } from "@/lib/store";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const deviceService = {
  async setPower(device: DeviceKey, on: boolean) {
    await delay(900);
    // Simulate an occasional network failure.
    if (Math.random() < 0.08) throw new Error("Unable to update device status.");
    return { device, on, updatedAt: new Date().toISOString() };
  },
};

export interface CardDetails {
  number: string;
  expiry: string;
  cvv: string;
  amount: number;
}

export function validateCard(d: CardDetails): string | null {
  if (d.number.replace(/\s/g, "").length !== 16 || /\D/.test(d.number.replace(/\s/g, "")))
    return "Please enter a valid card number.";
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(d.expiry)) return "Please enter a valid expiry date (MM/YY).";
  if (!/^\d{3,4}$/.test(d.cvv)) return "Please enter a valid CVV.";
  if (!(d.amount > 0)) return "Please enter a valid amount.";
  return null;
}

export const paymentService = {
  async pay(d: CardDetails) {
    const err = validateCard(d);
    if (err) throw new Error(err);
    await delay(1600);
    return {
      transactionId: "TX-" + Math.random().toString(16).slice(2, 10).toUpperCase(),
      date: new Date().toISOString(),
      amount: d.amount,
    };
  },
};
