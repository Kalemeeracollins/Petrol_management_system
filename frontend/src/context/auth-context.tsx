"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

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
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (name: string, email: string, password: string, role?: string) => Promise<void> // ✅ added
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // 🔹 Fetch logged-in user on app start
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          withCredentials: true,
        })
        setUser(res.data)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  // 🔹 Login function
  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        { withCredentials: true }
      )

      const loggedInUser = res.data.user || res.data
      setUser(loggedInUser)

      // Redirect by role
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

  // 🔹 Register function (NEW)
  const register = async (name: string, email: string, password: string, role = "ATTENDANT") => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register", // your backend attendants route
        { name, email, password, role },
        { withCredentials: true }
      )

      // Optional: set user if you want to log in right after register
      // setUser(res.data.user || res.data)

      console.log("Attendant created:", res.data)
      alert("✅ Attendant added successfully!")
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.message || "Registration failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // 🔹 Logout
  const logout = async () => {
    setLoading(true)
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true })
    } catch {
      // ignore errors
    } finally {
      setUser(null)
      setLoading(false)
      router.push("/login")
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        error,
        login,
        logout,
        register, // ✅ added here
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
// Fetch user on page load
export const fetchUser = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/auth/me", {
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to fetch user");

    const data = await res.json();
    setUser(data.user); // attach to context
    setIsAuthenticated(true);
  } catch (err) {
    console.error(err);
    setUser(null);
    setIsAuthenticated(false);
  }
};
function setIsAuthenticated(arg0: boolean) {
  throw new Error("Function not implemented.")
}

function setUser(user: any) {
  throw new Error("Function not implemented.")
}

