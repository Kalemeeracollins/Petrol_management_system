import { cn } from "@/app/utils/cn";
import type { HTMLAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-transparent/10 p-6 shadow-lg shadow-black/5 backdrop-blur transition-all [@media(prefers-reduced-motion:reduce)]:transition-none",
        "bg-white/85 text-slate-900 shadow-white/20 ring-1 ring-white/30 dark:border-white/10 dark:bg-white/10 dark:text-white dark:shadow-indigo-900/20 dark:ring-1 dark:ring-white/10",
        className
      )}
      {...props}
    />
  );
}
