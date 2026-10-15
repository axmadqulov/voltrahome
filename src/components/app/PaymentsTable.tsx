import { CreditCard } from "lucide-react";
import { EmptyState, StatusBadge } from "./ui";
import { fmtDate, money } from "@/lib/data";

export function PaymentsTable({ rows }: { rows: { id: string; utility: string; amount: number; date: string }[] }) {
  if (!rows.length) return <EmptyState icon={<CreditCard />} title="No payments yet" />;
  return (
    <div className="-mx-5 overflow-x-auto sm:-mx-6">
      <table className="w-full min-w-[560px] text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="px-5 py-3 font-semibold sm:px-6">Transaction</th>
            <th className="px-3 py-3 font-semibold">Utility</th>
            <th className="px-3 py-3 font-semibold">Date</th>
            <th className="px-3 py-3 font-semibold">Amount</th>
            <th className="px-5 py-3 font-semibold sm:px-6">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.id} className="border-b border-border last:border-0 transition-colors hover:bg-muted/50">
              <td className="px-5 py-3 font-mono text-xs sm:px-6">{p.id}</td>
              <td className="px-3 py-3 font-medium">{p.utility}</td>
              <td className="px-3 py-3 text-muted-foreground">{fmtDate(p.date)}</td>
              <td className="px-3 py-3 font-semibold">{money(p.amount)}</td>
              <td className="px-5 py-3 sm:px-6"><StatusBadge status="Paid" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
