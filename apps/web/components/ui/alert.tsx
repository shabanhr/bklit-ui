import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "group/alert relative grid w-full gap-1 rounded-lg border px-4 py-3 text-left text-xs/relaxed has-data-[slot=alert-action]:relative has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-3 has-data-[slot=alert-action]:pr-18 *:[svg:not([class*='size-'])]:size-3.5 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive:
          "bg-card text-destructive *:data-[slot=alert-description]:text-destructive/90 *:[svg]:text-current",
        emerald:
          "border-emerald-500/25 bg-emerald-500/10 text-emerald-950 *:data-[slot=alert-description]:text-emerald-900/85 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-50 dark:*:data-[slot=alert-description]:text-emerald-100/80 *:[svg]:text-emerald-600 dark:*:[svg]:text-emerald-400",
        indigo:
          "border-blue-500/25 bg-blue-500/10 text-blue-950 *:data-[slot=alert-description]:text-blue-900/85 dark:border-blue-500/50 dark:bg-blue-600/20 dark:text-blue-50 dark:*:data-[slot=alert-description]:text-blue-100/80 *:[svg]:text-blue-600 dark:*:[svg]:text-blue-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      className={cn(alertVariants({ variant }), className)}
      data-slot="alert"
      role="alert"
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "font-medium group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground",
        className
      )}
      data-slot="alert-title"
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "text-balance text-muted-foreground text-xs/relaxed md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
        className
      )}
      data-slot="alert-description"
      {...props}
    />
  );
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("absolute top-1.5 right-2", className)}
      data-slot="alert-action"
      {...props}
    />
  );
}

export { Alert, AlertAction, AlertDescription, AlertTitle };
