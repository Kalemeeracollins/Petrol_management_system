"use client"

import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Navbar } from "./navbar"
import { Sidebar } from "./sidebar"

interface ProtectedLayoutProps {
  children: React.ReactNode
}

export function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  // -----------------------------
  // 🌙 Dark Mode State
  // -----------------------------
  const [theme, setTheme] = useState<"light" | "dark">("light")

  // Load saved theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    if (savedTheme) setTheme(savedTheme)
  }, [])

  // Apply theme to <body> whenever it changes
  useEffect(() => {
    document.body.classList.remove("light", "dark")
    document.body.classList.add(theme)
    localStorage.setItem("theme", theme)
  }, [theme])

  // -----------------------------
  // 🔐 Authentication Redirect
  // -----------------------------
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [loading, isAuthenticated, router])

  // -----------------------------
  // 🔄 Theme Toggle Function
  // -----------------------------
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"))
  }

  if (loading) return <p>Loading...</p>
  if (!isAuthenticated) return null

  return (
    <>
      {/* Pass toggleTheme to Navbar so user can switch */}
      <Navbar toggleTheme={toggleTheme} theme={theme} />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </>
  )
}
