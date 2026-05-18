import type { ReactNode } from "react";
import type { StudioFrameSize } from "@/components/studio/studio-chart-viewport";
import type { StudioUrlState } from "./studio-parsers";

export interface StudioRenderContext {
  animationKey: number;
  /** Debounced signature of motion URL state — remount charts to replay enter. */
  motionRemountKey: string;
  /** Committed URL state (without slider / bezier preview overrides). */
  committedState: StudioUrlState;
  motionCurveDragging: boolean;
  patternDefs: ReactNode;
  patternFill: string | undefined;
  frame: StudioFrameSize;
}
