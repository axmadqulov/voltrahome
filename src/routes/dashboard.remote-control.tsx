import { createFileRoute } from "@tanstack/react-router";
import { Droplets, Flame, History, Power, Zap } from "lucide-react";
import type { ReactNode } from "react";
import { Card, EmptyState, LoadingSpinner, PageHeader, StatusBadge, Toggle } from "@/components/app/ui";
import { useDeviceControl } from "@/components/app/DeviceControl";
import { fmtDate, fmtTime } from "@/lib/data";
import { useStore, type DeviceKey } from "@/lib/store";
import { cn } from "@/lib/utils";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/dashboard/remote-control")({
  head: () => seo("Remote Control", "Switch electricity, gas and water on or off remotely."),
  component: Remote,
});

const DEVICES: { device: DeviceKey; name: string; icon: ReactNode; tone: string; desc: string }[] = [
  { device: "electricity", name: "Electricity", icon: <Zap />, tone: "bg-primary/10 text-primary", desc: "Main circuit breaker" },
  { device: "gas", name: "Gas", icon: <Flame />, tone: "bg-warning/15 text-warning", desc: "Gas supply valve" },
  { device: "water", name: "Water", icon: <Droplets />, tone: "bg-info/12 text-info", desc: "Main water valve" },
];

function Remote() {
  const { history } = useStore();
  return (
    <>
      <PageHeader title="Remote Control" description="Every action is confirmed and logged." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {DEVICES.map((d) => <ControlCard key={d.device} {...d} />)}
      </div>
      <Card className="mt-6">
        <div className="mb-4 flex items-center gap-2"><History className="size-4 text-muted-foreground" /><h3 className="font-semibold">Action history</h3></div>
        {history.length === 0 ? <EmptyState title="No actions yet" /> : (
          <ul className="divide-y divide-border">
            {history.map((h) => (
              <li key={h.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <span className="flex items-center gap-3"><Power className="size-4 text-muted-foreground" />{h.text} — {fmtTime(h.date)}</span>
                <span className="text-xs text-muted-foreground">{fmtDate(h.date)}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}

function ControlCard({ device, name, icon, tone, desc }: (typeof DEVICES)[number]) {
  const c = useDeviceControl(device);
  return (
    <Card hover className={cn("relative overflow-hidden transition-colors", c.on && "border-primary/30")}>
      <div className="flex items-start justify-between">
        <div className={cn("flex size-14 items-center justify-center rounded-2xl [&_svg]:size-7", tone)}>{icon}</div>
        <StatusBadge status="ONLINE" />
      </div>
      <p className="mt-6 text-xl font-bold">{name}</p>
      <p className="text-sm text-muted-foreground">{desc}</p>
      <div className="mt-6 flex items-center justify-between rounded-xl bg-muted p-4">
        <div>
          <p className="text-xs text-muted-foreground">Power</p>
          <p className={cn("text-lg font-bold", c.on ? "text-success" : "text-muted-foreground")}>
            {c.loading ? <LoadingSpinner label="Updating..." /> : c.on ? "ON" : "OFF"}
          </p>
        </div>
        <Toggle checked={c.on} onChange={c.request} disabled={c.loading} label={`Toggle ${name}`} />
      </div>
      {c.modal}
    </Card>
  );
}
