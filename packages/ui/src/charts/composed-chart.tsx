"use client";

import { ParentSize } from "@visx/responsive";
import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useMemo,
  useRef,
} from "react";
import { cn } from "@/lib/utils";
import { Area, type AreaProps } from "./area";
import type { LineConfig, Margin } from "./chart-context";
import { Line, type LineProps } from "./line";
import { SeriesBar, type SeriesBarProps } from "./series-bar";
import { TimeSeriesChartInner } from "./time-series-chart-shell";

export interface ComposedChartProps {
  /** Data array — each row typically has a date and multiple numeric series */
  data: Record<string, unknown>[];
  /** Key for the x-axis (time). Default: "date" */
  xDataKey?: string;
  margin?: Partial<Margin>;
  animationDuration?: number;
  aspectRatio?: string;
  className?: string;
  children: ReactNode;
  /** Target bar width in px (Recharts-style `barSize`). */
  barSize?: number;
  /** Maximum bar width in px (`maxBarSize`). */
  maxBarSize?: number;
  /** Gap between grouped `SeriesBar` series in px. Default: 4 */
  barGap?: number;
}

const DEFAULT_MARGIN: Margin = { top: 40, right: 40, bottom: 40, left: 40 };

function getChildComponentName(child: ReactElement): string {
  const childType = child.type as { displayName?: string; name?: string };
  return typeof child.type === "function"
    ? childType.displayName || childType.name || ""
    : "";
}

function tryAppendSeriesBar(
  child: ReactElement,
  lines: LineConfig[],
  barDataKeys: string[]
): boolean {
  const name = getChildComponentName(child);
  if (!(child.type === SeriesBar || name === "SeriesBar")) {
    return false;
  }
  const props = child.props as SeriesBarProps;
  if (!props.dataKey) {
    return true;
  }
  barDataKeys.push(props.dataKey);
  lines.push({
    dataKey: props.dataKey,
    stroke: props.stroke || props.fill || "var(--chart-line-primary)",
    strokeWidth: 0,
  });
  return true;
}

function tryAppendLine(child: ReactElement, lines: LineConfig[]): boolean {
  const name = getChildComponentName(child);
  if (!(child.type === Line || name === "Line")) {
    return false;
  }
  const props = child.props as LineProps;
  if (props.dataKey) {
    lines.push({
      dataKey: props.dataKey,
      stroke: props.stroke || "var(--chart-line-primary)",
      strokeWidth: props.strokeWidth ?? 2.5,
    });
  }
  return true;
}

function tryAppendArea(child: ReactElement, lines: LineConfig[]): boolean {
  const name = getChildComponentName(child);
  if (!(child.type === Area || name === "Area")) {
    return false;
  }
  const props = child.props as AreaProps;
  if (props.dataKey) {
    lines.push({
      dataKey: props.dataKey,
      stroke: props.stroke || props.fill || "var(--chart-line-primary)",
      strokeWidth: props.strokeWidth ?? 2,
    });
  }
  return true;
}

function extractComposedSeries(children: ReactNode): {
  lines: LineConfig[];
  barDataKeys: string[];
} {
  const lines: LineConfig[] = [];
  const barDataKeys: string[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      return;
    }
    if (tryAppendSeriesBar(child, lines, barDataKeys)) {
      return;
    }
    if (tryAppendLine(child, lines)) {
      return;
    }
    tryAppendArea(child, lines);
  });

  return { lines, barDataKeys };
}

interface ChartInnerProps {
  width: number;
  height: number;
  data: Record<string, unknown>[];
  xDataKey: string;
  margin: Margin;
  animationDuration: number;
  children: ReactNode;
  containerRef: React.RefObject<HTMLDivElement | null>;
  barSize?: number;
  maxBarSize?: number;
  barGap?: number;
}

function ChartInner({
  width,
  height,
  data,
  xDataKey,
  margin,
  animationDuration,
  children,
  containerRef,
  barSize,
  maxBarSize,
  barGap,
}: ChartInnerProps) {
  const { lines, barDataKeys } = useMemo(
    () => extractComposedSeries(children),
    [children]
  );

  return (
    <TimeSeriesChartInner
      animationDuration={animationDuration}
      clipPathId="composed-chart-grow-clip"
      composedBarDataKeys={barDataKeys.length > 0 ? barDataKeys : undefined}
      composedBarGap={barGap}
      composedBarSize={barSize}
      composedMaxBarSize={maxBarSize}
      containerRef={containerRef}
      data={data}
      height={height}
      lines={lines}
      margin={margin}
      width={width}
      xDataKey={xDataKey}
    >
      {children}
    </TimeSeriesChartInner>
  );
}

export function ComposedChart({
  data,
  xDataKey = "date",
  margin: marginProp,
  animationDuration = 1100,
  aspectRatio = "2 / 1",
  className = "",
  children,
  barSize,
  maxBarSize,
  barGap = 4,
}: ComposedChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const margin = { ...DEFAULT_MARGIN, ...marginProp };

  return (
    <div
      className={cn("relative w-full", className)}
      ref={containerRef}
      style={{ aspectRatio, touchAction: "none" }}
    >
      <ParentSize debounceTime={10}>
        {({ width, height }) => (
          <ChartInner
            animationDuration={animationDuration}
            barGap={barGap}
            barSize={barSize}
            containerRef={containerRef}
            data={data}
            height={height}
            margin={margin}
            maxBarSize={maxBarSize}
            width={width}
            xDataKey={xDataKey}
          >
            {children}
          </ChartInner>
        )}
      </ParentSize>
    </div>
  );
}

ComposedChart.displayName = "ComposedChart";

export default ComposedChart;
