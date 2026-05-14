"use client";

import {
  ChartTooltip,
  ComposedChart,
  Grid,
  Line,
  SeriesBar,
  XAxis,
  YAxis,
} from "@bklitui/ui/charts";

const demoData: Record<string, unknown>[] = (() => {
  const rows: Record<string, unknown>[] = [];
  const start = Date.now() - 13 * 24 * 60 * 60 * 1000;
  for (let i = 0; i < 14; i++) {
    const date = new Date(start + i * 24 * 60 * 60 * 1000);
    rows.push({
      date,
      volume: 40 + ((i * 17) % 55),
      price: 20 + Math.sin(i / 2) * 12 + i * 1.2,
    });
  }
  return rows;
})();

export default function PlaygroundPage() {
  return (
    <div className="min-h-screen bg-background px-4 py-10 text-foreground">
      <div className="mx-auto max-w-3xl space-y-4">
        <div>
          <h1 className="font-bold text-2xl">Composed chart</h1>
          <p className="text-muted-foreground text-sm">
            Shared time scale: <code className="text-xs">SeriesBar</code>{" "}
            (volume) + <code className="text-xs">Line</code> (price) from one{" "}
            <code className="text-xs">data</code> array.
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <ComposedChart
            aspectRatio="16 / 9"
            barGap={3}
            data={demoData}
            maxBarSize={14}
            xDataKey="date"
          >
            <Grid horizontal />
            <SeriesBar dataKey="volume" fill="var(--chart-3)" />
            <Line dataKey="price" stroke="var(--chart-1)" />
            <ChartTooltip />
            <XAxis />
            <YAxis />
          </ComposedChart>
        </div>
      </div>
    </div>
  );
}
