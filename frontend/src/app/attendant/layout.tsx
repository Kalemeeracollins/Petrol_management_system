"use client"

import { useAuth } from "@/context/auth-context"
import { useTheme } from "@/context/theme-context"
import { useRouter, usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import {
  MdDashboard,
  MdLocalGasStation,
  MdWork,
  MdPayments,
  MdNotifications,
  MdPerson,
  MdMenu,
  MdClose,
  MdLogout,
  MdDarkMode,
  MdLightMode,
} from "react-icons/md"
import Link from "next/link"

export default function AttendantLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const router = useRouter()
  const pathname = usePathname()

  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "ATTENDANT") {
      router.push("/login")
    }
  }, [isAuthenticated, user, router])

  const toggleSidebar = () => setSidebarOpen((prev) => !prev)

  return (
    <div
      className={`flex h-screen overflow-hidden transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full flex flex-col p-4 shadow-xl transition-all duration-500 ease-in-out transform z-40
          ${sidebarOpen ? "w-64" : "w-20"}
          ${theme === "dark" ? "bg-[#102525]" : "bg-[#1a3a3a] text-white"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1
            className={`text-2xl font-bold transition-all duration-300 ${
              sidebarOpen ? "opacity-100" : "opacity-0 hidden"
            }`}
          >
            ⛽ Attendant
          </h1>
          <button
            onClick={toggleSidebar}
            className="text-2xl hover:text-yellow-400"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <MdClose /> : <MdMenu />}
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col space-y-2">
          <NavLink href="/attendant/dashboard" icon={<MdDashboard />} label="Dashboard" active={pathname === "/attendant/dashboard"} sidebarOpen={sidebarOpen} />
          <NavLink href="/attendant/sales" icon={<MdLocalGasStation />} label="Fuel Sales" active={pathname === "/attendant/sales"} sidebarOpen={sidebarOpen} />
          <NavLink href="/attendant/shifts" icon={<MdWork />} label="Shifts" active={pathname === "/attendant/shifts"} sidebarOpen={sidebarOpen} />
          <NavLink href="/attendant/alerts" icon={<MdNotifications />} label="Alerts" active={pathname === "/attendant/alerts"} sidebarOpen={sidebarOpen} />
          <NavLink href="/attendant/profile" icon={<MdPerson />} label="Profile" active={pathname === "/attendant/profile"} sidebarOpen={sidebarOpen} />
        </nav>

        {/* Logout */}
        <button
          onClick={logout}
          className={`mt-auto flex items-center gap-3 bg-red-600 hover:bg-red-700 font-semibold py-2 rounded-lg transition-all
            ${sidebarOpen ? "justify-center" : "justify-center w-10 h-10 mx-auto"}
          `}
        >
          <MdLogout />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </aside>

      {/* Main Section */}
      <div
        className={`flex flex-col flex-1 transition-all duration-500 ease-in-out ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        {/* Topbar */}
        <header
          className={`sticky top-0 z-30 shadow-md p-4 flex justify-between items-center transition-colors duration-300
            ${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}
          `}
        >
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">Welcome, {user?.name || "Attendant"}</h2>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-300">Role: {user?.role}</span>
            <button
              onClick={toggleTheme}
              className="text-2xl hover:text-yellow-400 transition"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <MdDarkMode /> : <MdLightMode />}
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 w-full overflow-y-auto p-6 bg-inherit">
          <div className="min-h-full w-full rounded-xl transition-all duration-300">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

function NavLink({
  href,
  icon,
  label,
  active,
  sidebarOpen,
}: {
  href: string
  icon: React.ReactNode
  label: string
  active: boolean
  sidebarOpen: boolean
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-300
        ${active ? "bg-teal-600 text-white" : "hover:bg-teal-700 text-gray-200"}
        ${sidebarOpen ? "justify-start" : "justify-center"}
      `}
    >
      <span className="text-xl">{icon}</span>
      {sidebarOpen && <span className="font-medium">{label}</span>}
    </Link>
  )
}
