import { useEffect, useState, type ReactElement } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface Series {
  key: string;
  name: string;
  color: string;
}

export const COLORS = {
  electricity: "var(--chart-1)",
  gas: "var(--chart-2)",
  water: "var(--chart-3)",
  success: "var(--chart-4)",
};

const axis = { stroke: "var(--muted-foreground)", fontSize: 12, tickLine: false, axisLine: false };
const tooltipStyle = {
  contentStyle: { background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, color: "var(--popover-foreground)", fontSize: 12 },
  cursor: { fill: "color-mix(in oklab, var(--primary) 6%, transparent)" },
};

function Box({ height, children }: { height: number; children: ReactElement }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return <div style={{ height }} className="w-full">{ready && <ResponsiveContainer>{children}</ResponsiveContainer>}</div>;
}

type Data = Record<string, string | number | undefined>[];

export function UsageAreaChart({ data, series, height = 260, unit }: { data: Data; series: Series[]; height?: number; unit?: string }) {
  return (
    <Box height={height}>
        <AreaChart data={data} margin={{ left: -16, right: 8, top: 4 }}>
          <defs>
            {series.map((s) => (
              <linearGradient key={s.key} id={`g-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity={0.28} />
                <stop offset="100%" stopColor={s.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis dataKey="label" {...axis} />
          <YAxis {...axis} unit={unit} />
          <Tooltip {...tooltipStyle} />
          {series.length > 1 && <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />}
          {series.map((s) => (
            <Area key={s.key} type="monotone" dataKey={s.key} name={s.name} stroke={s.color} strokeWidth={2.5} fill={`url(#g-${s.key})`} />
          ))}
        </AreaChart>
    </Box>
  );
}

export function UsageBarChart({ data, series, height = 260, unit, stacked }: { data: Data; series: Series[]; height?: number; unit?: string; stacked?: boolean }) {
  return (
    <Box height={height}>
        <BarChart data={data} margin={{ left: -16, right: 8, top: 4 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis dataKey="label" {...axis} />
          <YAxis {...axis} unit={unit} />
          <Tooltip {...tooltipStyle} />
          {series.length > 1 && <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />}
          {series.map((s, i) => (
            <Bar key={s.key} dataKey={s.key} name={s.name} fill={s.color} stackId={stacked ? "a" : undefined} radius={stacked && i < series.length - 1 ? 0 : [6, 6, 0, 0]} maxBarSize={36} />
          ))}
        </BarChart>
    </Box>
  );
}

export function UsageLineChart({ data, series, height = 260, unit }: { data: Data; series: Series[]; height?: number; unit?: string }) {
  return (
    <Box height={height}>
        <LineChart data={data} margin={{ left: -16, right: 8, top: 4 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis dataKey="label" {...axis} />
          <YAxis {...axis} unit={unit} />
          <Tooltip {...tooltipStyle} />
          {series.length > 1 && <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />}
          {series.map((s) => (
            <Line key={s.key} type="monotone" dataKey={s.key} name={s.name} stroke={s.color} strokeWidth={2.5} dot={false} />
          ))}
        </LineChart>
    </Box>
  );
}
