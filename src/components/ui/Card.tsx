import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glass?: boolean;
}

export function Card({
  className,
  hover = false,
  glass = false,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface p-6 shadow-sm",
        hover && "transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-brand/30",
        glass && "glass",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
