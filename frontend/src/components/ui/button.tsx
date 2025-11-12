import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/app/utils/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  isLoading?: boolean;
  icon?: ReactNode;
}

export function Button({
  children,
  className,
  variant = "primary",
  isLoading,
  icon,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 [@media(prefers-reduced-motion:reduce)]:transition-none",
        {
          "bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 text-white shadow-lg shadow-blue-500/40 hover:shadow-purple-500/50 focus-visible:outline-indigo-400 dark:from-indigo-400 dark:via-purple-500 dark:to-fuchsia-500":
            variant === "primary",
          "bg-white/90 text-slate-900 shadow hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white":
            variant === "secondary",
          "bg-transparent text-slate-900 hover:bg-slate-900/5 dark:text-white dark:hover:bg-white/5":
            variant === "ghost",
          "bg-red-500 text-white shadow shadow-red-500/40 hover:bg-red-600 focus-visible:outline-red-400 dark:shadow-red-900/40":
            variant === "danger",
        },
        className,
        variant === "secondary" && "border"
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          role="status"
          aria-label="Loading"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      )}
      {icon}
      <span className="whitespace-nowrap">{isLoading ? "Please wait" : children}</span>
    </button>
  );
}
