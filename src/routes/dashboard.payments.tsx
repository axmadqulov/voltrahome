import { createFileRoute } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { CalendarClock, Droplets, Flame, Heater, Plug, Wifi, Zap } from "lucide-react";
import { Button, Card, PageHeader, StatusBadge } from "@/components/app/ui";
import { PaymentModal } from "@/components/app/PaymentModal";
import { PaymentsTable } from "@/components/app/PaymentsTable";
import { fmtDate, money, type Bill, type BillId } from "@/lib/data";
import { useStore } from "@/lib/store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/dashboard/payments")({
  head: () => seo("Utility Payments", "Pay electricity, gas, water, heating and internet bills."),
  component: Payments,
});

const ICONS: Record<BillId, ReactNode> = { electricity: <Zap />, gas: <Flame />, water: <Droplets />, heating: <Heater />, internet: <Wifi />, other: <Plug /> };

function Payments() {
  const { bills, payments } = useStore();
  const [active, setActive] = useState<Bill | null>(null);
  const total = bills.reduce((s, b) => s + b.debt, 0);
  return (
    <>
      <PageHeader title="Utility Payments" description={`Total outstanding: ${money(total)}`} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {bills.map((b) => (
          <Card key={b.id} hover className="flex flex-col">
            <div className="flex items-start justify-between">
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary [&_svg]:size-5">{ICONS[b.id]}</div>
              <StatusBadge status={b.status} />
            </div>
            <p className="mt-4 font-semibold">{b.name}</p>
            <p className="text-xs text-muted-foreground">Current Debt</p>
            <p className="mt-1 text-3xl font-bold tracking-tight">{money(b.debt)}</p>
            <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground"><CalendarClock className="size-4" /> Due {fmtDate(b.due)}</p>
            <Button className="mt-5 w-full" disabled={b.debt <= 0} onClick={() => setActive(b)}>{b.debt > 0 ? "Pay Now" : "Paid"}</Button>
          </Card>
        ))}
      </div>
      <Card className="mt-6">
        <h3 className="mb-4 font-semibold">Payment history</h3>
        <PaymentsTable rows={payments} />
      </Card>
      <PaymentModal bill={active} onClose={() => setActive(null)} />
    </>
  );
}
