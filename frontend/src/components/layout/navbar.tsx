"use client"

import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface NavbarProps {
  theme: "light" | "dark"
  toggleTheme: () => void
}

export function Navbar({ theme, toggleTheme }: NavbarProps) {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <nav
      className={`shadow-lg ${theme === "dark" ? "bg-slate-900 text-white" : "bg-white text-slate-900"}`}
      role="navigation"
      aria-label="Main"
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href="/admin/dashboard"
            className={`font-bold text-lg transition ${
              theme === "dark" ? "hover:text-blue-400" : "hover:text-blue-600"
            }`}
          >
            Petrol Station
          </Link>
        </div>

        <div>
          <button
            onClick={toggleTheme}
            className="px-3 py-1 rounded bg-gray-700 text-white hover:bg-gray-600 transition"
          >
            {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </button>
        </div>

        <div className="flex items-center gap-4">
          <span className={`text-sm ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
            Welcome, {user?.name}
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleLogout}
            aria-label="Logout"
          >
            Logout
          </Button>
        </div>
      </div>
    </nav>
  )
}
