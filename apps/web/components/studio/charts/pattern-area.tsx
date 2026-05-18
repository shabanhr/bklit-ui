"use client";

import { ChartRevealClip, useChart } from "@bklitui/ui/charts";
import type { curveMonotoneX } from "@visx/curve";
import { AreaClosed } from "@visx/shape";
import { useId } from "react";

export function StudioPatternArea({
  dataKey,
  fill,
  curve,
}: {
  dataKey: string;
  fill: string;
  curve?: typeof curveMonotoneX;
}) {
  const clipSuffix = useId();
  const {
    data,
    xScale,
    yScale,
    xAccessor,
    innerHeight,
    innerWidth,
    enterTransition,
    revealEpoch,
  } = useChart();

  const clipPathId = `grow-clip-pattern-${dataKey}${clipSuffix}`;

  if (data.length < 2) {
    return (
      <AreaClosed
        curve={curve}
        data={data}
        fill={fill}
        x={(d) => xScale(xAccessor(d)) ?? 0}
        y={(d) => {
          const v = d[dataKey];
          return typeof v === "number" ? (yScale(v) ?? 0) : 0;
        }}
        yScale={yScale}
      />
    );
  }

  return (
    <>
      <defs>
        <ChartRevealClip
          clipPathId={clipPathId}
          enterTransition={enterTransition}
          height={innerHeight + 20}
          revealEpoch={revealEpoch ?? 0}
          targetWidth={innerWidth}
        />
      </defs>
      <g clipPath={`url(#${clipPathId})`}>
        <AreaClosed
          curve={curve}
          data={data}
          fill={fill}
          x={(d) => xScale(xAccessor(d)) ?? 0}
          y={(d) => {
            const v = d[dataKey];
            return typeof v === "number" ? (yScale(v) ?? 0) : 0;
          }}
          yScale={yScale}
        />
      </g>
    </>
  );
}
