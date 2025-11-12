import { cn } from "@/app/utils/cn";
import type { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-xl border border-slate-200/60 bg-white/90 px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/10 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20",
        className
      )}
      {...props}
    />
  );
}
