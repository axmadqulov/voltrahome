import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Activity, AlertTriangle, CalendarDays, DollarSign, Flame, Gauge, ShieldCheck } from "lucide-react";
import { Button, Card, ChartCard, PageHeader, StatCard, StatusBadge, type Status } from "@/components/app/ui";
import { DeviceToggle } from "@/components/app/DeviceControl";
import { COLORS, UsageAreaChart } from "@/components/app/charts";
import { hourlyUsage, money, RATES, USAGE } from "@/lib/data";
import { useStore } from "@/lib/store";
import { useLive } from "@/hooks/use-live";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/dashboard/gas")({
  head: () => seo("Gas Booster", "Gas pressure, usage and safety status (simulation)."),
  component: Gas,
});

function Gas() {
  const { devices, notify } = useStore();
  const on = devices.gas;
  const [mode, setMode] = useState<"normal" | "warning" | "emergency">("normal");
  const pressure = useLive(mode === "warning" ? 2.9 : mode === "emergency" ? 3.6 : USAGE.gas.pressure, 0.2, on);
  const current = useLive(0.42, 0.15, on);
  const status: Status = !on ? "OFF" : mode === "emergency" ? "EMERGENCY" : mode === "warning" ? "WARNING" : "ON";

  const simulate = (m: typeof mode) => {
    setMode(m);
    if (m !== "normal") notify({ title: "Gas alert", message: m === "emergency" ? "Gas emergency detected — check the system immediately." : "Gas pressure is above the normal range.", type: m === "emergency" ? "danger" : "warning" });
  };

  return (
    <>
      <PageHeader title="Gas Booster" description="Simulation only — not connected to a real gas system." actions={<StatusBadge status={status} />} />
      <Card className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-warning/15 text-warning"><Flame className="size-6" /></div>
          <div>
            <p className="font-semibold">Gas Status</p>
            <p className="text-sm text-muted-foreground">{on ? "Supply is active" : "Supply is switched off"}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => simulate("warning")} disabled={!on}><AlertTriangle className="size-4" /> Simulate warning</Button>
          <Button size="sm" variant="danger" onClick={() => simulate("emergency")} disabled={!on}>Emergency</Button>
          <Button size="sm" variant="ghost" onClick={() => setMode("normal")}>Reset</Button>
          <DeviceToggle device="gas" />
        </div>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard icon={<Gauge />} label="Pressure" value={pressure.toFixed(2)} unit="bar" description="Normal: 1.8 – 2.5 bar" status={status} />
        <StatCard icon={<Activity />} label="Current Usage" value={current.toFixed(2)} unit="m³/h" description="Live reading" />
        <StatCard icon={<Flame />} label="Daily Usage" value={USAGE.gas.daily} unit="m³" description="Today" trend={-2.1} />
        <StatCard icon={<CalendarDays />} label="Monthly Usage" value={USAGE.gas.monthly} unit="m³" description="This month" trend={-3.4} />
        <StatCard icon={<DollarSign />} label="Estimated Cost" value={money(USAGE.gas.monthly * RATES.gas)} description={`$${RATES.gas}/m³`} />
        <StatCard icon={<ShieldCheck />} label="System Status" value={status === "ON" ? "Healthy" : status === "OFF" ? "Idle" : "Attention"} description="Leak sensor active" />
      </div>
      <ChartCard title="Gas Consumption" subtitle="Today, hourly (m³)" className="mt-6">
        <UsageAreaChart data={hourlyUsage} series={[{ key: "gas", name: "Gas", color: COLORS.gas }]} />
      </ChartCard>
    </>
  );
}
