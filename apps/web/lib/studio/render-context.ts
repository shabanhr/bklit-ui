import type { ReactNode } from "react";
import type { StudioFrameSize } from "@/components/studio/studio-chart-viewport";

export interface StudioRenderContext {
  animationKey: number;
  /** Debounced signature of motion URL state — remount charts to replay enter. */
  motionRemountKey: string;
  patternDefs: ReactNode;
  patternFill: string | undefined;
  frame: StudioFrameSize;
}
