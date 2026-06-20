import { cn } from "@/lib/utils";
import { LabelHTMLAttributes } from "react";

export function Label({
  className,
  children,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "block text-sm font-medium text-foreground mb-1.5",
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
}
