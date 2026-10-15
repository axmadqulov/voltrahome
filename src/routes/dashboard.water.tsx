import { createFileRoute } from "@tanstack/react-router";
import { Activity, CalendarDays, DollarSign, Droplets, Waves } from "lucide-react";
import { Card, ChartCard, PageHeader, StatCard, StatusBadge } from "@/components/app/ui";
import { DeviceToggle } from "@/components/app/DeviceControl";
import { COLORS, UsageBarChart } from "@/components/app/charts";
import { money, RATES, USAGE, weeklyUsage } from "@/lib/data";
import { useStore } from "@/lib/store";
import { useLive } from "@/hooks/use-live";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/dashboard/water")({
  head: () => seo("Water Control", "Water flow, usage and remote shut-off."),
  component: Water,
});

function Water() {
  const on = useStore().devices.water;
  const flow = useLive(USAGE.water.flow, 1.2, on);
  return (
    <>
      <PageHeader title="Water Control" description="Track flow and switch the main water supply." actions={<StatusBadge status={on ? "ON" : "OFF"} />} />
      <Card className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-info/12 text-info"><Droplets className="size-6" /></div>
          <div><p className="font-semibold">Water Status</p><p className="text-sm text-muted-foreground">{on ? "Main valve open" : "Main valve closed"}</p></div>
        </div>
        <DeviceToggle device="water" />
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard icon={<Activity />} iconClass="bg-info/12 text-info" label="Current Consumption" value={(flow * 0.06).toFixed(2)} unit="m³/h" description="Live" status={on ? "ONLINE" : "OFF"} />
        <StatCard icon={<Droplets />} iconClass="bg-info/12 text-info" label="Daily Usage" value={USAGE.water.daily} unit="m³" description="Today" trend={1.8} />
        <StatCard icon={<CalendarDays />} iconClass="bg-info/12 text-info" label="Monthly Usage" value={USAGE.water.monthly} unit="m³" description="This month" trend={4.1} />
        <StatCard icon={<Waves />} iconClass="bg-info/12 text-info" label="Water Flow" value={flow.toFixed(1)} unit="L/min" description="Flow meter" />
        <StatCard icon={<DollarSign />} iconClass="bg-info/12 text-info" label="Estimated Cost" value={money(USAGE.water.monthly * RATES.water)} description={`$${RATES.water}/m³`} />
      </div>
      <ChartCard title="Water usage" subtitle="This week (m³)" className="mt-6">
        <UsageBarChart data={weeklyUsage} series={[{ key: "water", name: "Water", color: COLORS.water }]} />
      </ChartCard>
    </>
  );
}
