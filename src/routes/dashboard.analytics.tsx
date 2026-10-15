import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChartCard, PageHeader, Segmented } from "@/components/app/ui";
import { COLORS, UsageAreaChart, UsageBarChart, UsageLineChart } from "@/components/app/charts";
import { analyticsSeries, monthlyExpenses, weeklyUsage, hourlyUsage, type Range } from "@/lib/data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/dashboard/analytics")({
  head: () => seo("Analytics", "Usage trends and expenses for electricity, gas and water."),
  component: Analytics,
});

const RANGES: { value: Range; label: string }[] = [
  { value: "7d", label: "7 Days" }, { value: "30d", label: "30 Days" }, { value: "3m", label: "3 Months" }, { value: "1y", label: "1 Year" },
];

function Analytics() {
  const [range, setRange] = useState<Range>("7d");
  const data = useMemo(() => analyticsSeries(range), [range]);
  return (
    <>
      <PageHeader title="Analytics" description="Understand where your energy and money go." actions={<Segmented value={range} onChange={setRange} options={RANGES} />} />
      <div className="grid gap-6 lg:grid-cols-3">
        <ChartCard title="Electricity Usage" subtitle="kWh"><UsageAreaChart data={data} height={200} series={[{ key: "electricity", name: "Electricity", color: COLORS.electricity }]} /></ChartCard>
        <ChartCard title="Gas Usage" subtitle="m³"><UsageAreaChart data={data} height={200} series={[{ key: "gas", name: "Gas", color: COLORS.gas }]} /></ChartCard>
        <ChartCard title="Water Usage" subtitle="m³"><UsageAreaChart data={data} height={200} series={[{ key: "water", name: "Water", color: COLORS.water }]} /></ChartCard>
      </div>
      <ChartCard title="Monthly Expenses" subtitle="USD per utility" className="mt-6">
        <UsageBarChart stacked data={monthlyExpenses} height={300} series={[
          { key: "electricity", name: "Electricity", color: COLORS.electricity },
          { key: "gas", name: "Gas", color: COLORS.gas },
          { key: "water", name: "Water", color: COLORS.water },
        ]} />
      </ChartCard>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ChartCard title="Daily Consumption" subtitle="Hourly profile">
          <UsageLineChart data={hourlyUsage} series={[{ key: "electricity", name: "Electricity", color: COLORS.electricity }, { key: "gas", name: "Gas", color: COLORS.gas }]} />
        </ChartCard>
        <ChartCard title="Weekly Consumption" subtitle="By day">
          <UsageBarChart data={weeklyUsage} series={[{ key: "electricity", name: "Electricity", color: COLORS.electricity }, { key: "gas", name: "Gas", color: COLORS.gas }]} />
        </ChartCard>
      </div>
    </>
  );
}
