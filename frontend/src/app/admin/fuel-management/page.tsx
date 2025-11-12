"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { ProtectedLayout } from "@/components/layout/protected-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert } from "@/components/ui/alert"

interface Fuel {
  id: string
  name: string
  pricePerLitre: number
  quantityInStock: number
}

export default function FuelManagementPage() {
  const { isAuthenticated } = useAuth()
  const [fuels, setFuels] = useState<Fuel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: "", price: "", quantity: "" })

  useEffect(() => {
    if (isAuthenticated) fetchFuels()
  }, [isAuthenticated])

  const fetchFuels = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/fuel", {
        credentials: 'include',
      })
      const data = await response.json()
      setFuels(data || [])
    } catch (err) {
      setError("Failed to fetch fuel data")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingId ? `http://localhost:5000/api/fuel/${editingId}` : "http://localhost:5000/api/fuel"
      const method = editingId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          pricePerLitre: Number.parseFloat(formData.price),
          quantityInStock: Number.parseFloat(formData.quantity),
        }),
      })

      if (response.ok) {
        setFormData({ name: "", price: "", quantity: "" })
        setEditingId(null)
        setShowForm(false)
        fetchFuels()
      }
    } catch (err) {
      setError("Failed to save fuel")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/api/fuel/${id}`, {
        method: "DELETE",
        credentials: 'include',
      })
      fetchFuels()
    } catch (err) {
      setError("Failed to delete fuel")
    }
  }

  return (
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Fuel Management</h1>
          <Button onClick={() => setShowForm(!showForm)} aria-label="Add new fuel">
            {showForm ? "Cancel" : "Add Fuel"}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            {error}
          </Alert>
        )}

        {showForm && (
          <Card className="mb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Fuel name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  aria-label="Fuel name"
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Price per liter"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  aria-label="Price per liter"
                  step="0.01"
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Quantity (liters)"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  required
                  aria-label="Quantity in liters"
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button type="submit" aria-label="Save fuel">
                Save Fuel
              </Button>
            </form>
          </Card>
        )}

        {loading ? (
          <p>Loading...</p>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full" role="table">
                <thead className="border-b border-slate-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Fuel Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Price/L</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Quantity (L)</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {fuels.map((fuel) => (
                    <tr key={fuel.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4">{fuel.name}</td>
                      <td className="py-3 px-4">UGX.{fuel.pricePerLitre.toFixed(2)}</td>
                      <td className="py-3 px-4">{fuel.quantityInStock}</td>
                      <td className="py-3 px-4 space-x-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setFormData({
                              name: fuel.name,
                              price: fuel.pricePerLitre.toString(),
                              quantity: fuel.quantityInStock.toString(),
                            })
                            setEditingId(fuel.id)
                            setShowForm(true)
                          }}
                          aria-label={`Edit ${fuel.name}`}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(fuel.id)}
                          aria-label={`Delete ${fuel.name}`}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>

  )
}
