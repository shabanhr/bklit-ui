import { renderMediaOnWeb } from "@remotion/web-renderer";
import type React from "react";
import {
  StudioCaptureComposition,
  type StudioCaptureCompositionProps,
} from "@/components/studio/studio-capture-composition";
import {
  framesForNativeTimeline,
  type StudioRecordingTimeline,
  type TimestampedFrame,
} from "./studio-recording";

export interface EncodeStudioRecordingOptions {
  frames: TimestampedFrame[];
  timeline: StudioRecordingTimeline;
  width: number;
  height: number;
  chartSlug: string;
  onProgress?: (progress: number) => void;
  signal?: AbortSignal;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

/** Fallback encode: one video frame per DOM snapshot at native capture rate. */
export async function encodeStudioRecording(
  options: EncodeStudioRecordingOptions
): Promise<void> {
  const { frames, timeline, width, height, chartSlug, onProgress, signal } =
    options;

  if (frames.length === 0) {
    throw new Error("No frames captured");
  }

  const { blobs, fps, durationInFrames } = framesForNativeTimeline(
    frames,
    timeline
  );
  const frameUrls = blobs.map((blob) => URL.createObjectURL(blob));

  try {
    if (signal?.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }

    const inputProps: StudioCaptureCompositionProps = {
      frames: frameUrls,
      width,
      height,
    };

    const { getBlob } = await renderMediaOnWeb({
      composition: {
        id: "StudioCapture",
        component: StudioCaptureComposition as unknown as React.FC<
          Record<string, unknown>
        >,
        durationInFrames,
        fps,
        width,
        height,
        defaultProps: inputProps as unknown as Record<string, unknown>,
      },
      inputProps: inputProps as unknown as Record<string, unknown>,
      muted: true,
      videoBitrate: "very-high",
      hardwareAcceleration: "prefer-hardware",
      keyframeIntervalInSeconds: 2,
      signal,
      onProgress: ({ progress }) => {
        onProgress?.(progress);
      },
    });

    const blob = await getBlob();
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    downloadBlob(blob, `bklit-studio-${chartSlug}-${timestamp}.mp4`);
  } finally {
    for (const url of frameUrls) {
      URL.revokeObjectURL(url);
    }
  }
}
