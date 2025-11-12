"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function Sidebar() {
  const pathname = usePathname()

  const menuItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/admin/fuel-management", label: "Fuel Management", icon: "⛽" },
    { href: "/admin/restock", label: "Restock Fuel", icon: "📦" },
    { href: "/admin/maintenance", label: "Schedule Maintenance", icon: "🔧" },
    { href: "/admin/shifts", label: "Assign Shifts", icon: "📅" },
    { href: "/admin/pump-attendant", label: "Pumps & Attendants", icon: "👥" },
    { href: "/admin/sales-records", label: "Sales Records", icon: "💰" },
    { href: "/admin/reports", label: "Reports", icon: "📈" },
    { href: "/admin/settings", label: "Settings", icon: "⚙️" },
  ]

  return (
    <aside className="">
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-700"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <span aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
