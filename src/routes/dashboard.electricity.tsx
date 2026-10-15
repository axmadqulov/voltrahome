import { createFileRoute } from "@tanstack/react-router";
import { Activity, CalendarDays, CalendarRange, DollarSign, Gauge, Zap } from "lucide-react";
import { Card, ChartCard, PageHeader, StatCard, StatusBadge } from "@/components/app/ui";
import { DeviceToggle } from "@/components/app/DeviceControl";
import { COLORS, UsageAreaChart, UsageBarChart } from "@/components/app/charts";
import { hourlyUsage, money, RATES, USAGE, weeklyUsage } from "@/lib/data";
import { useStore } from "@/lib/store";
import { useLive } from "@/hooks/use-live";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/dashboard/electricity")({
  head: () => seo("Electricity", "Live electricity load, voltage and bill estimate."),
  component: Electricity,
});

function Electricity() {
  const on = useStore().devices.electricity;
  const load = useLive(1.84, 0.6, on);
  const voltage = useLive(USAGE.electricity.voltage, 6, on);
  return (
    <>
      <PageHeader title="Electricity" description="Monitor consumption and power status in real time." actions={<StatusBadge status={on ? "ON" : "OFF"} />} />
      <Card className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Zap className="size-6" /></div>
          <div><p className="font-semibold">Main power</p><p className="text-sm text-muted-foreground">{on ? "Power is on" : "Power is off"}</p></div>
        </div>
        <DeviceToggle device="electricity" />
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard icon={<Activity />} label="Current Consumption" value={load.toFixed(2)} unit="kW" description="Live load" status={on ? "ONLINE" : "OFF"} />
        <StatCard icon={<Zap />} label="Daily Consumption" value={USAGE.electricity.daily} unit="kWh" description="Today" trend={5.6} />
        <StatCard icon={<CalendarRange />} label="Weekly Consumption" value={USAGE.electricity.weekly} unit="kWh" description="This week" trend={8.2} />
        <StatCard icon={<CalendarDays />} label="Monthly Consumption" value={USAGE.electricity.monthly} unit="kWh" description="This month" trend={2.3} />
        <StatCard icon={<Gauge />} label="Voltage" value={Math.round(voltage)} unit="V" description="Stable range 210–230 V" />
        <StatCard icon={<DollarSign />} label="Estimated Bill" value={money(USAGE.electricity.monthly * RATES.electricity)} description={`$${RATES.electricity}/kWh`} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ChartCard title="Today" subtitle="Hourly load (kWh)">
          <UsageAreaChart data={hourlyUsage} series={[{ key: "electricity", name: "Electricity", color: COLORS.electricity }]} />
        </ChartCard>
        <ChartCard title="This week" subtitle="Daily consumption (kWh)">
          <UsageBarChart data={weeklyUsage} series={[{ key: "electricity", name: "Electricity", color: COLORS.electricity }]} />
        </ChartCard>
      </div>
    </>
  );
}
