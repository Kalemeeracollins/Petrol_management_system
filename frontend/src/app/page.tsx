"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../context/auth-context"

export default function Home() {
  const router = useRouter()
  const { isAuthenticated, user, loading } = useAuth()

  useEffect(() => {
    if (loading) return // Wait for auth state to load

    if (!isAuthenticated || !user) {
      router.push("/login")
      return
    }

    // Redirect based on role
    switch (user.role) {
      case "ADMIN":
        router.push("/admin/dashboard")
        break
      case "ATTENDANT":
        router.push("/attendant/dashboard")
        break
      case "SUPPLIER":
        router.push("/supplier/dashboard")
        break
      default:
        router.push("/login")
    }
  }, [isAuthenticated, user, loading, router])

  return null // No visible content while redirecting
}
