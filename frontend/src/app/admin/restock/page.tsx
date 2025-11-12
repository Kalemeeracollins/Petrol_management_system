"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert } from "@/components/ui/alert"
import { motion, AnimatePresence } from "framer-motion"
import { MdAdd, MdEdit, MdLocalGasStation, MdInventory, MdWarning } from "react-icons/md"

interface Fuel {
  id: number
  name: string
  pricePerLitre: number
  quantityInStock: number
}

interface Attendant {
  id: number
  name: string
  email: string
}

interface RestockRecord {
  id: number
  fuelTypeId: number
  attendantId: number
  quantityAdded: number
  supplierName: string
  invoiceNumber: string
  restockDate: string
  notes?: string
  fuelType?: {
    name: string
    pricePerLitre: number
  }
  attendant?: {
    name: string
    email: string
  }
}

export default function RestockPage() {
  const { isAuthenticated } = useAuth()
  const [fuels, setFuels] = useState<Fuel[]>([])
  const [attendants, setAttendants] = useState<Attendant[]>([])
  const [restockRecords, setRestockRecords] = useState<RestockRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    fuelTypeId: "",
    attendantId: "",
    quantityAdded: "",
    supplierName: "",
    invoiceNumber: "",
    notes: ""
  })

  useEffect(() => {
    if (isAuthenticated) {
      fetchFuels()
      fetchAttendants()
      fetchRestockRecords()
    }
  }, [isAuthenticated])

  const fetchFuels = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/fuel", {
        credentials: 'include'
      })
      const data = await res.json()
      setFuels(Array.isArray(data) ? data : data.fuels || [])
    } catch (err) {
      console.error("Failed to fetch fuels", err)
    }
  }

  const fetchAttendants = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/attendants", {
        credentials: 'include'
      })
      const data = await res.json()
      setAttendants(Array.isArray(data) ? data : data.attendants || [])
    } catch (err) {
      console.error("Failed to fetch attendants", err)
    }
  }

  const fetchRestockRecords = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/fuel/restock-records", {
        credentials: 'include'
      })
      const data = await res.json()
      console.log("Restock data:", data) // 👀 For debugging
      // ✅ Ensure we always set an array
      setRestockRecords(Array.isArray(data) ? data : data.restockRecords || [])
    } catch (err) {
      console.error("Failed to fetch restock records", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      const res = await fetch("http://localhost:5000/api/fuel/restock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({
          fuelTypeId: Number(formData.fuelTypeId),
          attendantId: Number(formData.attendantId),
          quantityAdded: Number(formData.quantityAdded),
          supplierName: formData.supplierName,
          invoiceNumber: formData.invoiceNumber,
          notes: formData.notes
        })
      })

      if (res.ok) {
        setSuccess("Fuel restocked successfully!")
        resetForm()
        fetchFuels()
        fetchRestockRecords()
      } else {
        const errData = await res.json()
        setError(errData.message || "Failed to restock fuel")
      }
    } catch (err) {
      setError("Failed to restock fuel")
    }
  }

  const resetForm = () => {
    setFormData({
      fuelTypeId: "",
      attendantId: "",
      quantityAdded: "",
      supplierName: "",
      invoiceNumber: "",
      notes: ""
    })
    setShowForm(false)
  }

  const lowStockFuels = fuels.filter(fuel => fuel.quantityInStock < 1000)

  return (
      <div className="min-h-screen p-6 w-full bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl shadow-lg">
                <MdInventory className="text-3xl text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Fuel Restock Management</h1>
                <p className="text-slate-600">Restock fuel inventory and track supplies</p>
              </div>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-lg"
            >
              <MdAdd className="text-xl" />
              {showForm ? "Cancel" : "Restock Fuel"}
            </Button>
          </div>

          {error && <Alert variant="destructive" className="mb-6">{error}</Alert>}
          {success && <Alert variant="success" className="mb-6">{success}</Alert>}

          {lowStockFuels.length > 0 && (
            <Card className="mb-6 p-4 bg-amber-50 border-amber-200">
              <div className="flex items-center gap-3">
                <MdWarning className="text-2xl text-amber-600" />
                <div>
                  <h3 className="font-semibold text-amber-800">Low Stock Alert</h3>
                  <p className="text-amber-700">
                    {lowStockFuels.length} fuel type{lowStockFuels.length > 1 ? 's' : ''} below 1000L: {lowStockFuels.map(f => f.name).join(', ')}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* === FORM === */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8"
              >
                <Card className="p-6 bg-white shadow-lg border-0">
                  <h2 className="text-xl font-semibold mb-4 text-slate-900 flex items-center gap-2">
                    <MdAdd className="text-green-600" />
                    New Restock Entry
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Fuel Type *</label>
                        <select
                          value={formData.fuelTypeId}
                          onChange={(e) => setFormData({ ...formData, fuelTypeId: e.target.value })}
                          required
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        >
                          <option value="">Select Fuel Type</option>
                          {fuels.map((fuel) => (
                            <option key={fuel.id} value={fuel.id}>
                              {fuel.name} — Current Stock: {fuel.quantityInStock}L
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Attendant *</label>
                        <select
                          value={formData.attendantId}
                          onChange={(e) => setFormData({ ...formData, attendantId: e.target.value })}
                          required
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        >
                          <option value="">Select Attendant</option>
                          {attendants.map((att) => (
                            <option key={att.id} value={att.id}>{att.name} ({att.email})</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Quantity Added (L) *</label>
                        <input
                          type="number"
                          value={formData.quantityAdded}
                          onChange={(e) => setFormData({ ...formData, quantityAdded: e.target.value })}
                          placeholder="e.g., 5000"
                          required
                          min="1"
                          step="0.1"
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Supplier Name *</label>
                        <input
                          type="text"
                          value={formData.supplierName}
                          onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                          placeholder="e.g., PetroCorp Ltd"
                          required
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Invoice Number</label>
                        <input
                          type="text"
                          value={formData.invoiceNumber}
                          onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                          placeholder="e.g., INV-2024-001"
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={3}
                        placeholder="Optional notes about the restock..."
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3">
                        Restock Fuel
                      </Button>
                      <Button type="button" onClick={resetForm} variant="secondary" className="px-6 py-3">
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* === RESTOCK HISTORY === */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-slate-600">Loading restock records...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <MdInventory className="text-green-600" />
                  Restock History
                </h2>
                {restockRecords.length === 0 ? (
                  <Card className="p-8 text-center bg-white">
                    <MdInventory className="text-5xl text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No restock records yet</p>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {restockRecords.map((record) => (
                      <motion.div
                        key={record.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-lg shadow-md p-4 border border-slate-200"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="p-2 bg-green-100 rounded-lg">
                                <MdLocalGasStation className="text-xl text-green-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-slate-900">
                                  {record.fuelType?.name} - {record.quantityAdded}L Added
                                </h3>
                                <p className="text-sm text-slate-600">
                                  by {record.attendant?.name} • {new Date(record.restockDate).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-600">
                              <div>
                                <span className="font-medium">Supplier:</span> {record.supplierName}
                              </div>
                              {record.invoiceNumber && (
                                <div>
                                  <span className="font-medium">Invoice:</span> {record.invoiceNumber}
                                </div>
                              )}
                            </div>
                            {record.notes && (
                              <div className="mt-2 p-2 bg-slate-50 rounded-lg">
                                <p className="text-xs text-slate-700"><strong>Notes:</strong> {record.notes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
  )
}
