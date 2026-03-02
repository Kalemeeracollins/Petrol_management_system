"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

// Types
interface User {
  id: string
  name: string
  email: string
  role: "ADMIN" | "ATTENDANT" | "SUPPLIER" | "USER"
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  authToken: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (name: string, email: string, password: string, role?: string) => Promise<void>
}

// Create axios instance with base URL
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // if you still want to send cookies
})

// Add a request interceptor to attach token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [authToken, setAuthToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // 🔹 Restore session from localStorage on app start
  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (!token) {
      setLoading(false)
      return
    }

    setAuthToken(token)

    const fetchUser = async () => {
      try {
        // api interceptor will automatically add the token
        const res = await api.get("/auth/me")
        setUser(res.data)
      } catch {
        localStorage.removeItem("authToken")
        setAuthToken(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  // 🔹 Login
  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.post("/auth/login", { email, password })

      // Assuming backend returns { token, user }
      const { token, user: loggedInUser } = res.data

      if (token) {
        localStorage.setItem("authToken", token)
        setAuthToken(token)
      }
      setUser(loggedInUser)

      // Redirect based on role
      switch (loggedInUser.role) {
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
          router.push("/")
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // 🔹 Logout
  const logout = async () => {
    setLoading(true)
    try {
      await api.post("/auth/logout")
    } catch {
      // ignore
    } finally {
      localStorage.removeItem("authToken")
      setAuthToken(null)
      setUser(null)
      setLoading(false)
      router.push("/login")
    }
  }

  // 🔹 Register (e.g., for admins creating attendants)
  const register = async (name: string, email: string, password: string, role = "ATTENDANT") => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.post("/auth/register", { name, email, password, role })
      console.log("User created:", res.data)
      alert("✅ User added successfully!")
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.message || "Registration failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        error,
        authToken,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook for using auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Export the configured axios instance for use in components
export { api }