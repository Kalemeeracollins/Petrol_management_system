"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { ProtectedLayout } from "@/components/layout/protected-layout"
import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Alert } from "@/components/ui/alert"

export default function ReportsPage() {
  const { token } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const dailyData = [
    { day: "Mon", sales: 2400 },
    { day: "Tue", sales: 1398 },
    { day: "Wed", sales: 9800 },
    { day: "Thu", sales: 3908 },
    { day: "Fri", sales: 4800 },
    { day: "Sat", sales: 3800 },
    { day: "Sun", sales: 4300 },
  ]

  const fuelMixData = [
    { name: "Super 95", value: 45 },
    { name: "Diesel", value: 30 },
    { name: "Super 98", value: 15 },
    { name: "Eco Fuel", value: 10 },
  ]

  const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"]

  useEffect(() => {
    fetchReports()
  }, [token])

  const fetchReports = async () => {
    try {
      await fetch("http://localhost:5000/api/reports", {
        headers: { Authorization: `Bearer ${token}` },
      })
    } catch (err) {
      setError("Failed to fetch reports")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Reports & Analytics</h1>

        {error && (
          <div className="mb-6">
            <Alert variant="destructive">
              {error}
            </Alert>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Daily Sales</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#f1f5f9", border: "1px solid #cbd5e1" }}
                  labelStyle={{ color: "#1e293b" }}
                />
                <Bar dataKey="sales" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Fuel Mix</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={fuelMixData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {fuelMixData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card>
            <p className="text-sm text-slate-600">Weekly Revenue</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">$28,408</p>
            <p className="text-green-600 text-sm mt-2">↑ 12% from last week</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-600">Monthly Revenue</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">$120,540</p>
            <p className="text-green-600 text-sm mt-2">↑ 8% from last month</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-600">Average Daily Sales</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">$4,764</p>
            <p className="text-slate-600 text-sm mt-2">Based on weekly data</p>
          </Card>
        </div>
      </div>
    </ProtectedLayout>
  )
}
