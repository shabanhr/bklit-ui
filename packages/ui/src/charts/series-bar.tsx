"use client";

import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { chartCssVars, useChart } from "./chart-context";

const BAR_EASING = "cubic-bezier(0.85, 0, 0.15, 1)";

export interface SeriesBarProps {
  /** Key in data for bar height (y value) */
  dataKey: string;
  /** Fill color. Default: var(--chart-line-primary) */
  fill?: string;
  /** Tooltip dot color when fill is gradient/pattern. Default: fill */
  stroke?: string;
  /** Corner radius for bar top. Default: 4 */
  radius?: number;
  /** Animate grow from baseline. Default: true */
  animate?: boolean;
  /** Opacity for non-hovered bars when another point is hovered (matches BarChart). Default: 0.3 */
  fadedOpacity?: number;
}

export function SeriesBar({
  dataKey,
  fill = chartCssVars.linePrimary,
  radius = 4,
  animate = true,
  fadedOpacity = 0.3,
}: SeriesBarProps) {
  const {
    data,
    xScale,
    yScale,
    xAccessor,
    innerHeight,
    innerWidth,
    columnWidth,
    isLoaded,
    animationDuration,
    barScale,
    composedBarDataKeys,
    composedBarSize,
    composedMaxBarSize,
    composedBarGap,
    tooltipData,
  } = useChart();

  const barKeys = useMemo(() => {
    if (composedBarDataKeys && composedBarDataKeys.length > 0) {
      return composedBarDataKeys;
    }
    return [dataKey];
  }, [composedBarDataKeys, dataKey]);

  const seriesIndex = useMemo(() => {
    const idx = barKeys.indexOf(dataKey);
    return idx >= 0 ? idx : 0;
  }, [barKeys, dataKey]);

  const n = barKeys.length;
  const gap = composedBarGap ?? 4;

  const slot = useMemo(() => {
    if (columnWidth > 0) {
      return columnWidth;
    }
    if (data.length < 2) {
      return innerWidth;
    }
    return innerWidth / (data.length - 1);
  }, [columnWidth, data.length, innerWidth]);

  const barWidth = useMemo(() => {
    let w =
      composedBarSize ??
      Math.min(slot * 0.55, composedMaxBarSize ?? Number.POSITIVE_INFINITY);
    if (composedMaxBarSize != null) {
      w = Math.min(w, composedMaxBarSize);
    }
    if (n > 1) {
      const maxGroup = slot * 0.92;
      const needed = n * w + (n - 1) * gap;
      if (needed > maxGroup && maxGroup > 0) {
        w = Math.max(4, (maxGroup - (n - 1) * gap) / n);
      }
    }
    return Math.max(2, w);
  }, [composedBarSize, composedMaxBarSize, gap, n, slot]);

  const totalAnimDuration = animationDuration || 1100;
  const staggerSpread = totalAnimDuration * 0.4;
  const calculatedStaggerDelay =
    data.length > 1 ? staggerSpread / 1000 / data.length : 0;
  const barDuration = totalAnimDuration * 0.6;

  if (barScale) {
    console.warn(
      "SeriesBar is for time-based ComposedChart / LineChart context. Use Bar inside BarChart for categorical x."
    );
    return null;
  }

  const hoveredIndex = tooltipData?.index ?? null;

  return (
    <g className="series-bar">
      {data.map((d, i) => {
        const value = d[dataKey];
        if (typeof value !== "number") {
          return null;
        }

        const xCenter = xScale(xAccessor(d)) ?? 0;
        const groupWidth = n * barWidth + (n > 1 ? (n - 1) * gap : 0);
        const barLeft =
          xCenter - groupWidth / 2 + seriesIndex * (barWidth + gap);
        const valueY = yScale(value) ?? innerHeight;
        const barHeight = innerHeight - valueY;
        const categoryLabel = String(xAccessor(d).getTime());
        const isFaded = hoveredIndex !== null && hoveredIndex !== i;

        if (animate && !isLoaded) {
          return (
            <SeriesBarRect
              animationDuration={barDuration}
              barHeight={barHeight}
              barWidth={barWidth}
              calculatedStaggerDelay={calculatedStaggerDelay}
              fadedOpacity={fadedOpacity}
              fill={fill}
              index={i}
              innerHeight={innerHeight}
              isFaded={isFaded}
              key={`${dataKey}-${categoryLabel}`}
              radius={radius}
              x={barLeft}
              y={valueY}
            />
          );
        }

        return (
          <motion.rect
            animate={{ opacity: isFaded ? fadedOpacity : 1 }}
            fill={fill}
            height={barHeight}
            key={`${dataKey}-${categoryLabel}`}
            rx={radius}
            ry={radius}
            transition={{ opacity: { duration: 0.12 } }}
            width={barWidth}
            x={barLeft}
            y={valueY}
          />
        );
      })}
    </g>
  );
}

SeriesBar.displayName = "SeriesBar";

interface SeriesBarRectProps {
  x: number;
  y: number;
  barWidth: number;
  barHeight: number;
  fill: string;
  radius: number;
  index: number;
  innerHeight: number;
  calculatedStaggerDelay: number;
  animationDuration: number;
  isFaded: boolean;
  fadedOpacity: number;
}

function SeriesBarRect({
  x,
  y,
  barWidth,
  barHeight,
  fill,
  radius,
  index,
  innerHeight,
  calculatedStaggerDelay,
  animationDuration,
  isFaded,
  fadedOpacity,
}: SeriesBarRectProps) {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        setIsAnimated(true);
      },
      index * calculatedStaggerDelay * 1000
    );
    return () => clearTimeout(timeout);
  }, [index, calculatedStaggerDelay]);

  const h = isAnimated ? barHeight : 0;
  const yi = isAnimated ? y : innerHeight;

  return (
    <motion.rect
      animate={{ opacity: isFaded ? fadedOpacity : 1 }}
      fill={fill}
      height={h}
      rx={radius}
      ry={radius}
      style={{
        transition: `height ${animationDuration}ms ${BAR_EASING}, y ${animationDuration}ms ${BAR_EASING}`,
      }}
      transition={{ opacity: { duration: 0.12 } }}
      width={barWidth}
      x={x}
      y={yi}
    />
  );
}

export default SeriesBar;
