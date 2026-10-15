import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, Droplets, Flame, Wallet, Zap } from "lucide-react";
import { Card, ChartCard, EmptyState, PageHeader, StatCard } from "@/components/app/ui";
import { COLORS, UsageAreaChart } from "@/components/app/charts";
import { fmtTime, weeklyUsage } from "@/lib/data";
import { PaymentsTable } from "@/components/app/PaymentsTable";
import { useStore } from "@/lib/store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/dashboard/")({
  head: () => seo("Dashboard", "Overview of your home's electricity, gas and water usage."),
  component: Overview,
});

function Overview() {
  const { user, payments, history, devices } = useStore();
  return (
    <>
      <PageHeader title={`Welcome back, ${user?.username ?? ""}`} description="Here's what's happening at home today." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={<Zap />} label="Electricity" value="82" unit="kWh" description="This week" trend={8.2} status={devices.electricity ? "ONLINE" : "OFF"} />
        <StatCard icon={<Flame />} iconClass="bg-warning/15 text-warning" label="Gas" value="34" unit="m³" description="This month" trend={-3.4} status={devices.gas ? "ONLINE" : "OFF"} />
        <StatCard icon={<Droplets />} iconClass="bg-info/12 text-info" label="Water" value="18" unit="m³" description="This month" trend={4.1} status={devices.water ? "ONLINE" : "OFF"} />
        <StatCard icon={<Wallet />} iconClass="bg-success/12 text-success" label="Monthly Cost" value="$126.50" description="Estimated total" />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <ChartCard title="Consumption" subtitle="Last 7 days" className="lg:col-span-2">
          <UsageAreaChart data={weeklyUsage} series={[
            { key: "electricity", name: "Electricity (kWh)", color: COLORS.electricity },
            { key: "gas", name: "Gas (m³)", color: COLORS.gas },
          ]} />
        </ChartCard>
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Recent Activity</h3>
            <Activity className="size-4 text-muted-foreground" />
          </div>
          {history.length === 0 ? <EmptyState title="No activity yet" /> : (
            <ul className="space-y-3">
              {history.slice(0, 6).map((h) => (
                <li key={h.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-primary" />{h.text}</span>
                  <span className="text-xs text-muted-foreground">{fmtTime(h.date)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
      <Card className="mt-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">Recent Payments</h3>
          <Link to="/dashboard/payments" className="text-sm font-semibold text-primary hover:underline">View all</Link>
        </div>
        <PaymentsTable rows={payments.slice(0, 5)} />
      </Card>
    </>
  );
}

