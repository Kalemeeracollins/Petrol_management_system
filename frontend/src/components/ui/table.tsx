import { cn } from "@/app/utils/cn";
import type { HTMLAttributes, ReactNode } from "react";

export interface TableProps extends HTMLAttributes<HTMLTableElement> {}

export function Table({ className, ...props }: TableProps) {
  return (
    <div className="relative w-full overflow-auto">
      <table
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

export interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {}

export function TableHeader({ className, ...props }: TableHeaderProps) {
  return (
    <thead className={cn("[&_tr]:border-b", className)} {...props} />
  );
}

export interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {}

export function TableBody({ className, ...props }: TableBodyProps) {
  return (
    <tbody
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {}

export function TableRow({ className, ...props }: TableRowProps) {
  return (
    <tr
      className={cn(
        "border-b border-slate-200/60 transition-colors hover:bg-slate-50/50 data-[state=selected]:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5 dark:data-[state=selected]:bg-white/5",
        className
      )}
      {...props}
    />
  );
}

export interface TableHeadProps extends HTMLAttributes<HTMLTableCellElement> {}

export function TableHead({ className, ...props }: TableHeadProps) {
  return (
    <th
      className={cn(
        "h-12 px-4 text-left align-middle font-semibold text-slate-900 dark:text-white [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  );
}

export interface TableCellProps extends HTMLAttributes<HTMLTableCellElement> {
  colSpan?: number;
}

export function TableCell({ className, colSpan, ...props }: TableCellProps) {
  return (
    <td
      className={cn(
        "p-4 align-middle text-slate-700 dark:text-slate-300 [&:has([role=checkbox])]:pr-0",
        className
      )}
      colSpan={colSpan}
      {...props}
    />
  );
}

export interface TableCaptionProps extends HTMLAttributes<HTMLTableCaptionElement> {}

export function TableCaption({ className, ...props }: TableCaptionProps) {
  return (
    <caption
      className={cn("mt-4 text-sm text-slate-500 dark:text-slate-400", className)}
      {...props}
    />
  );
}
