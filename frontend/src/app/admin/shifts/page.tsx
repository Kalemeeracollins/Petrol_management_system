"use client"

import { useState, useEffect } from "react"
import { MdAdd, MdDelete, MdEdit, MdSchedule, MdPerson, MdAccessTime, MdCheckCircle, MdCancel, MdWarning } from "react-icons/md"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Alert } from "@/components/ui/alert"
import { motion, AnimatePresence } from "framer-motion"

interface Shift {
  id: number
  attendantId: number
  shiftType: "MORNING" | "AFTERNOON" | "NIGHT"
  scheduledDate: string
  scheduledStartTime: string
  scheduledEndTime: string
  actualStartTime?: string
  actualEndTime?: string
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "MISSED" | "CANCELLED"
  description?: string
  assignedPump?: string
  notes?: string
  attendant?: {
    id: number
    name: string
    email: string
  }
}

interface User {
  id: number
  name: string
  email: string
  role: string
  active: boolean
}

const shiftTypeConfig = {
  MORNING: { label: "Morning Shift", time: "06:00 - 14:00", color: "bg-amber-500", icon: "🌅" },
  AFTERNOON: { label: "Afternoon Shift", time: "14:00 - 22:00", color: "bg-orange-500", icon: "☀️" },
  NIGHT: { label: "Night Shift", time: "22:00 - 06:00", color: "bg-indigo-600", icon: "🌙" },
}

const statusConfig = {
  SCHEDULED: { label: "Scheduled", color: "bg-blue-100 text-blue-800", icon: <MdSchedule /> },
  IN_PROGRESS: { label: "In Progress", color: "bg-green-100 text-green-800", icon: <MdAccessTime /> },
  COMPLETED: { label: "Completed", color: "bg-gray-100 text-gray-800", icon: <MdCheckCircle /> },
  MISSED: { label: "Missed", color: "bg-red-100 text-red-800", icon: <MdWarning /> },
  CANCELLED: { label: "Cancelled", color: "bg-slate-100 text-slate-800", icon: <MdCancel /> },
}

export default function AdminShiftsPage() {
  const { user, isAuthenticated } = useAuth()
  const [shifts, setShifts] = useState<Shift[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    attendantId: "",
    shiftType: "",
    scheduledDate: "",
    scheduledStartTime: "",
    scheduledEndTime: "",
    description: "",
    assignedPump: ""
  })

  useEffect(() => {
    if (isAuthenticated) {
      fetchShifts()
      fetchUsers()
    }
  }, [isAuthenticated])

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users", {
        credentials: 'include',
      })
      if (response.ok) {
        const data = await response.json()
        // Filter only active ATTENDANT users
        const attendantUsers = data.filter((u: User) => u.role === "ATTENDANT" && u.active)
        setUsers(attendantUsers)
      }
    } catch (err) {
      console.error("Failed to fetch users:", err)
    }
  }

  const fetchShifts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/shifts", {
        credentials: 'include',
      })
      const data = await response.json()
      setShifts(data || [])
    } catch (err) {
      setError("Failed to load shifts")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const url = editingId 
        ? `http://localhost:5000/api/shifts/${editingId}` 
        : "http://localhost:5000/api/shifts"
      
      const method = editingId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({
          attendantId: Number(formData.attendantId),
          shiftType: formData.shiftType,
          scheduledDate: formData.scheduledDate,
          scheduledStartTime: formData.scheduledStartTime,
          scheduledEndTime: formData.scheduledEndTime,
          description: formData.description,
          assignedPump: formData.assignedPump
        }),
      })

      if (response.ok) {
        resetForm()
        fetchShifts()
      } else {
        const errData = await response.json()
        setError(errData.message || "Failed to save shift")
      }
    } catch (err) {
      setError("Failed to save shift")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this shift?")) return

    try {
      await fetch(`http://localhost:5000/api/shifts/${id}`, {
        method: "DELETE",
        credentials: 'include',
      })
      fetchShifts()
    } catch (err) {
      setError("Failed to delete shift")
    }
  }

  const handleEdit = (shift: Shift) => {
    setFormData({
      attendantId: shift.attendantId.toString(),
      shiftType: shift.shiftType,
      scheduledDate: shift.scheduledDate,
      scheduledStartTime: shift.scheduledStartTime,
      scheduledEndTime: shift.scheduledEndTime,
      description: shift.description || "",
      assignedPump: shift.assignedPump || ""
    })
    setEditingId(shift.id)
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      attendantId: "",
      shiftType: "",
      scheduledDate: "",
      scheduledStartTime: "",
      scheduledEndTime: "",
      description: "",
      assignedPump: ""
    })
    setEditingId(null)
    setShowForm(false)
  }

  const handleShiftTypeSelect = (type: string) => {
    const config = {
      MORNING: { start: "06:00", end: "14:00", desc: "Morning shift: Handle rush hour traffic, fuel deliveries, and opening procedures." },
      AFTERNOON: { start: "14:00", end: "22:00", desc: "Afternoon shift: Peak hours service, inventory checks, and customer service." },
      NIGHT: { start: "22:00", end: "06:00", desc: "Night shift: Security monitoring, late-night service, and closing procedures." },
    }[type]

    if (config) {
      setFormData({
        ...formData,
        shiftType: type,
        scheduledStartTime: config.start,
        scheduledEndTime: config.end,
        description: config.desc
      })
    }
  }

  return (
    <div className="min-h-screen p-6 w-full bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-600 rounded-lg">
              <MdSchedule className="text-3xl text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Shift Management</h1>
              <p className="text-slate-600">Assign and manage attendant shifts</p>
            </div>
          </div>
          <Button 
            onClick={() => setShowForm(!showForm)} 
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-lg"
          >
            <MdAdd className="text-xl" />
            {showForm ? "Cancel" : "Assign Shift"}
          </Button>
        </div>

        {error && <Alert variant="destructive" className="mb-6">{error}</Alert>}

        <AnimatePresence>
          {showForm && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: "auto" }} 
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <Card className="p-6 bg-white shadow-lg border-0">
                <h2 className="text-xl font-semibold mb-4 text-slate-900">
                  {editingId ? "Edit Shift Assignment" : "New Shift Assignment"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Attendant</label>
                      <select
                        value={formData.attendantId}
                        onChange={(e) => setFormData({ ...formData, attendantId: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select Attendant</option>
                        {users.map((user) => (
                          <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Shift Type</label>
                      <div className="grid grid-cols-3 gap-2">
                        {Object.entries(shiftTypeConfig).map(([key, config]) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => handleShiftTypeSelect(key)}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              formData.shiftType === key 
                                ? `${config.color} text-white border-transparent shadow-lg` 
                                : 'bg-white border-slate-300 hover:border-indigo-300'
                            }`}
                          >
                            <div className="text-2xl mb-1">{config.icon}</div>
                            <div className="text-xs font-medium">{config.label.split(" ")[0]}</div>
                            <div className="text-xs opacity-80">{config.time.split(" - ")[0]}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                      <input
                        type="date"
                        value={formData.scheduledDate}
                        onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Assigned Pump</label>
                      <input
                        type="text"
                        value={formData.assignedPump}
                        onChange={(e) => setFormData({ ...formData, assignedPump: e.target.value })}
                        placeholder="e.g., Pump 1, Pump A"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Shift Description & Instructions</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        placeholder="Enter shift responsibilities, tasks, and special instructions..."
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3">
                      {editingId ? "Update Shift" : "Assign Shift"}
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

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading shifts...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {["SCHEDULED", "IN_PROGRESS", "COMPLETED", "MISSED"].map((status) => {
              const statusShifts = shifts.filter((s) => s.status === status)
              if (statusShifts.length === 0) return null

              return (
                <div key={status}>
                  <h2 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    {statusConfig[status as keyof typeof statusConfig].icon}
                    {statusConfig[status as keyof typeof statusConfig].label} ({statusShifts.length})
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {statusShifts.map((shift) => (
                      <motion.div
                        key={shift.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200 hover:shadow-lg transition-shadow"
                      >
                        <div className={`${shiftTypeConfig[shift.shiftType].color} text-white p-4`}>
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="text-3xl mb-1">{shiftTypeConfig[shift.shiftType].icon}</div>
                              <h3 className="font-bold text-lg">{shiftTypeConfig[shift.shiftType].label}</h3>
                              <p className="text-sm opacity-90">{shiftTypeConfig[shift.shiftType].time}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig[shift.status].color}`}>
                              {statusConfig[shift.status].label}
                            </span>
                          </div>
                        </div>

                        <div className="p-4 space-y-3">
                          <div className="flex items-center gap-2 text-slate-700">
                            <MdPerson className="text-indigo-600" />
                            <span className="font-semibold">{shift.attendant?.name || "Unknown"}</span>
                          </div>

                          <div className="text-sm text-slate-600 space-y-1">
                            <div className="flex justify-between">
                              <span className="font-medium">Date:</span>
                              <span>{new Date(shift.scheduledDate).toLocaleDateString()}</span>
                            </div>
                            {shift.assignedPump && (
                              <div className="flex justify-between">
                                <span className="font-medium">Pump:</span>
                                <span className="font-semibold text-indigo-600">{shift.assignedPump}</span>
                              </div>
                            )}
                            {shift.actualStartTime && (
                              <div className="flex justify-between">
                                <span className="font-medium">Clocked In:</span>
                                <span>{new Date(shift.actualStartTime).toLocaleTimeString()}</span>
                              </div>
                            )}
                            {shift.actualEndTime && (
                              <div className="flex justify-between">
                                <span className="font-medium">Clocked Out:</span>
                                <span>{new Date(shift.actualEndTime).toLocaleTimeString()}</span>
                              </div>
                            )}
                          </div>

                          {shift.description && (
                            <div className="pt-2 border-t border-slate-200">
                              <p className="text-xs text-slate-600 italic">{shift.description}</p>
                            </div>
                          )}

                          {shift.notes && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                              <p className="text-xs text-yellow-800"><strong>Notes:</strong> {shift.notes}</p>
                            </div>
                          )}

                          <div className="flex gap-2 pt-2">
                            <Button
                              onClick={() => handleEdit(shift)}
                              variant="secondary"
                              className="flex-1 text-sm py-2"
                            >
                              <MdEdit className="mr-1" /> Edit
                            </Button>
                            <Button
                              onClick={() => handleDelete(shift.id)}
                              variant="danger"
                              className="flex-1 text-sm py-2"
                            >
                              <MdDelete className="mr-1" /> Delete
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )
            })}

            {shifts.length === 0 && !loading && (
              <Card className="p-12 text-center bg-white">
                <MdSchedule className="text-6xl text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-700 mb-2">No Shifts Assigned Yet</h3>
                <p className="text-slate-500 mb-6">Start by creating your first shift assignment</p>
                <Button onClick={() => setShowForm(true)} className="bg-indigo-600 hover:bg-indigo-700">
                  <MdAdd className="mr-2" /> Assign First Shift
                </Button>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
