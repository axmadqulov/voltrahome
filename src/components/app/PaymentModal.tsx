import { useEffect, useState, type FormEvent } from "react";
import { CheckCircle2, CreditCard, Lock } from "lucide-react";
import { Button, Input, LoadingSpinner, Modal } from "./ui";
import { paymentService } from "@/services/api";
import { fmtDate, fmtTime, money, type Bill } from "@/lib/data";
import { useStore } from "@/lib/store";

type Receipt = { transactionId: string; date: string; amount: number };

const fmtCard = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
const fmtExp = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

export function PaymentModal({ bill, onClose }: { bill: Bill | null; onClose: () => void }) {
  const { recordPayment } = useStore();
  const [form, setForm] = useState({ number: "", expiry: "", cvv: "", amount: "" });
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"form" | "processing" | "done">("form");
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  useEffect(() => {
    if (bill) {
      setForm({ number: "", expiry: "", cvv: "", amount: bill.debt.toFixed(2) });
      setError(null);
      setStep("form");
      setReceipt(null);
    }
  }, [bill]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!bill) return;
    setError(null);
    setStep("processing");
    try {
      const r = await paymentService.pay({ ...form, amount: parseFloat(form.amount) });
      recordPayment(bill.id, r.amount, r.transactionId, r.date);
      setReceipt(r);
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed.");
      setStep("form");
    }
  };

  return (
    <Modal open={!!bill} onClose={step === "processing" ? () => {} : onClose} title={step === "done" ? undefined : `Pay ${bill?.name ?? ""}`}>
      {step === "processing" && (
        <div className="flex flex-col items-center py-10 text-center">
          <LoadingSpinner className="size-10 text-primary" />
          <p className="mt-4 font-semibold">Processing Payment...</p>
          <p className="text-sm text-muted-foreground">Please don't close this window.</p>
        </div>
      )}

      {step === "done" && receipt && (
        <div className="text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-success/12 text-success animate-in zoom-in-50 duration-300">
            <CheckCircle2 className="size-8" />
          </div>
          <h3 className="mt-4 text-xl font-bold">Payment Successful</h3>
          <p className="text-sm text-muted-foreground">{bill?.name} bill has been paid.</p>
          <dl className="mt-6 space-y-3 rounded-2xl bg-muted p-4 text-left text-sm">
            <Row k="Transaction ID" v={receipt.transactionId} />
            <Row k="Date" v={`${fmtDate(receipt.date)} · ${fmtTime(receipt.date)}`} />
            <Row k="Amount" v={money(receipt.amount)} />
          </dl>
          <Button className="mt-6 w-full" onClick={onClose}>Done</Button>
        </div>
      )}

      {step === "form" && (
        <form onSubmit={submit} className="space-y-4" noValidate>
          <Input label="Card Number" name="card" inputMode="numeric" placeholder="4242 4242 4242 4242" icon={<CreditCard />} value={form.number} onChange={(e) => setForm({ ...form, number: fmtCard(e.target.value) })} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Expiry Date" name="exp" placeholder="MM/YY" value={form.expiry} onChange={(e) => setForm({ ...form, expiry: fmtExp(e.target.value) })} />
            <Input label="CVV" name="cvv" type="password" inputMode="numeric" placeholder="123" value={form.cvv} onChange={(e) => setForm({ ...form, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })} />
          </div>
          <Input label="Amount (USD)" name="amount" type="number" step="0.01" min="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          {error && <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">{error}</p>}
          <Button type="submit" className="w-full" size="lg">
            <Lock className="size-4" /> Pay {form.amount ? money(parseFloat(form.amount) || 0) : ""}
          </Button>
          <p className="text-center text-xs text-muted-foreground">Demo payment — no real money is charged.</p>
        </form>
      )}
    </Modal>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="font-semibold">{v}</dd>
    </div>
  );
}
