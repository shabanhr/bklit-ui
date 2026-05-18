"use client";

import type { Transition } from "motion/react";
import { motion } from "motion/react";
import { DEFAULT_CHART_ENTER_TRANSITION } from "./animation";

export interface ChartRevealClipProps {
  clipPathId: string;
  height: number;
  targetWidth: number;
  enterTransition?: Transition;
  /** Bumps when motion settings change to replay the reveal. */
  revealEpoch: number;
}

/**
 * Left-to-right clip reveal for cartesian series.
 * Grows clip rect width from 0 → full (true LTR; scaleX is avoided — it reveals from center).
 */
export function ChartRevealClip({
  clipPathId,
  height,
  targetWidth,
  enterTransition,
  revealEpoch,
}: ChartRevealClipProps) {
  if (targetWidth <= 0) {
    return null;
  }

  const transition: Transition =
    enterTransition ?? DEFAULT_CHART_ENTER_TRANSITION;

  return (
    <clipPath id={clipPathId}>
      <motion.rect
        animate={{ width: targetWidth }}
        height={height}
        initial={{ width: 0 }}
        key={`reveal-${revealEpoch}`}
        transition={transition}
        width={targetWidth}
        x={0}
        y={0}
      />
    </clipPath>
  );
}
