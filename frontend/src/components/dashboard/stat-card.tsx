import type { ReactNode } from "react";
import { cn } from "@/app/utils/cn";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  trendLabel?: string;
  trendValue?: string;
  dark?: boolean;
}

export default function StatCard({
  title,
  value,
  icon,
  trendLabel,
  trendValue,
  dark,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 p-6 shadow-xl transition-all",
        dark
          ? "bg-gradient-to-br from-slate-900/80 via-indigo-900/50 to-sky-900/30 text-white"
          : "bg-gradient-to-br from-white via-slate-50 to-slate-100 text-slate-900"
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-600/90 dark:text-white/70">
            {title}
          </p>
          <p className="mt-3 text-3xl font-semibold text-balance">
            {value}
          </p>
        </div>
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl text-2xl",
            dark ? "bg-white/15 shadow-inner shadow-slate-900/30" : "bg-gradient-to-br from-slate-200 via-slate-100 to-white shadow-inner shadow-white/60"
          )}
          aria-hidden
        >
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
      {(trendLabel || trendValue) && (
        <div
          className={cn(
            "mt-4 flex items-center gap-2 text-sm",
            dark ? "text-emerald-300" : "text-emerald-500"
          )}
        >
          <span className="font-medium tracking-tight">{trendLabel}</span>
          <span>{trendValue}</span>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div
          className={cn(
            "absolute -right-12 -top-16 h-40 w-40 rounded-full blur-3xl",
            dark ? "bg-cyan-400/20" : "bg-indigo-300/25"
          )}
        />
        <div
          className={cn(
            "absolute bottom-0 right-0 h-24 w-24 rounded-full blur-3xl",
            dark ? "bg-fuchsia-400/20" : "bg-amber-200/30"
          )}
        />
      </div>
    </motion.div>
  );
}
