"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { generateStudioCode } from "@/lib/studio/codegen";
import type { StudioUrlState } from "@/lib/studio/studio-parsers";
import { CopyButton } from "./copy-button";

const StudioHighlightedCode = dynamic(
  () =>
    import("./studio-highlighted-code").then(
      (mod) => mod.StudioHighlightedCode
    ),
  {
    ssr: false,
    loading: () => (
      <pre className="max-h-[min(60vh,32rem)] overflow-auto rounded-lg border bg-muted/40 p-4 font-mono text-xs">
        <code>Loading…</code>
      </pre>
    ),
  }
);

export function StudioCodeSheet({ state }: { state: StudioUrlState }) {
  const [open, setOpen] = useState(false);
  const { code, data, title } = generateStudioCode(state.chart, state);
  const fullCode = data ? `${data}\n\n${code}` : code;

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button className="h-10 px-4 text-sm" type="button" variant="outline">
          Get code
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <div className="flex items-start justify-between gap-2 pr-8">
            <div>
              <SheetTitle>{title}</SheetTitle>
              <SheetDescription>
                Copy this snippet — props match your current studio settings.
              </SheetDescription>
            </div>
            <CopyButton text={fullCode} />
          </div>
        </SheetHeader>
        {open ? (
          <div className="space-y-4 px-6 pb-6">
            <StudioHighlightedCode code={code} lang="tsx" />
            {data ? (
              <>
                <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                  Data
                </p>
                <StudioHighlightedCode code={data} lang="tsx" />
              </>
            ) : null}
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
