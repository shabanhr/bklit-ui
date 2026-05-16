"use client";

import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";
import { codeThemes } from "@/lib/code-theme";
import { cn } from "@/lib/utils";

export function StudioHighlightedCode({
  code,
  lang,
  className,
}: {
  code: string;
  lang: string;
  className?: string;
}) {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setHtml(null);

    codeToHtml(code, {
      lang,
      themes: codeThemes,
    })
      .then((result) => {
        if (!cancelled) {
          setHtml(result);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setHtml(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [code, lang]);

  if (!html) {
    return (
      <pre
        className={cn(
          "max-h-[min(60vh,32rem)] overflow-auto rounded-lg border bg-muted/40 p-4 font-mono text-xs leading-relaxed",
          className
        )}
      >
        <code>{code}</code>
      </pre>
    );
  }

  return (
    <div
      className={cn(
        "max-h-[min(60vh,32rem)] overflow-auto rounded-lg border bg-muted/20 text-xs [&_pre]:m-0! [&_pre]:bg-transparent! [&_pre]:p-4!",
        className
      )}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted Shiki output
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
