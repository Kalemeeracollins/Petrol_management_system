import type { JSX, PropsWithChildren } from "react";
import { cn } from "@/app/utils/cn";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";

type AlertVariant = "default" | "success" | "destructive" | "warning";

interface AlertProps extends PropsWithChildren {
  variant?: AlertVariant;
  title?: string;
}

const iconByVariant: Record<AlertVariant, JSX.Element> = {
  default: <Info className="h-5 w-5" aria-hidden="true" />, 
  success: <CheckCircle2 className="h-5 w-5" aria-hidden="true" />, 
  destructive: <XCircle className="h-5 w-5" aria-hidden="true" />, 
  warning: <AlertTriangle className="h-5 w-5" aria-hidden="true" />, 
};

export function Alert({ variant = "default", title, children }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-sm",
        {
          "border-slate-200/60 bg-slate-50/80 text-slate-900 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-white":
            variant === "default",
          "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 backdrop-blur dark:border-emerald-400/40 dark:bg-emerald-400/10 dark:text-emerald-100":
            variant === "success",
          "border-rose-500/30 bg-rose-500/10 text-rose-700 backdrop-blur dark:border-rose-400/40 dark:bg-rose-400/10 dark:text-rose-100":
            variant === "destructive",
          "border-amber-400/40 bg-amber-400/10 text-amber-700 backdrop-blur dark:border-amber-400/40 dark:bg-amber-400/10 dark:text-amber-100":
            variant === "warning",
        }
      )}
    >
      <div className="mt-0.5 flex h-6 w-6 items-center justify-center text-inherit">
        {iconByVariant[variant]}
      </div>
      <div className="space-y-1 text-left">
        {title && <p className="font-semibold leading-none">{title}</p>}
        <div className="text-sm opacity-90">{children}</div>
      </div>
    </div>
  );
}
