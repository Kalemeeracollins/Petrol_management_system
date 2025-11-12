"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert } from "@/components/ui/alert"
import { motion, AnimatePresence } from "framer-motion"
import { MdAdd, MdBuild, MdPerson, MdSchedule, MdCheckCircle, MdPending, MdCancel, MdWarning } from "react-icons/md"

interface Attendant {
  id: number
  name: string
  email: string
}

interface MaintenanceTask {
  id: number
  attendantId: number
  taskType: "PUMP_MAINTENANCE" | "TANK_CLEANING" | "EQUIPMENT_REPAIR" | "SAFETY_CHECK" | "GENERAL"
  description: string
  scheduledDate: string
  scheduledTime: string
  estimatedDuration: number
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
  assignedPump?: string
  notes?: string
  completedAt?: string
  attendant?: {
    id: number
    name: string
    email: string
  }
}

const taskTypeConfig = {
  PUMP_MAINTENANCE: { label: "Pump Maintenance", icon: "⛽", color: "bg-blue-500" },
  TANK_CLEANING: { label: "Tank Cleaning", icon: "🛢️", color: "bg-green-500" },
  EQUIPMENT_REPAIR: { label: "Equipment Repair", icon: "🔧", color: "bg-orange-500" },
  SAFETY_CHECK: { label: "Safety Check", icon: "⚠️", color: "bg-red-500" },
  GENERAL: { label: "General Maintenance", icon: "🛠️", color: "bg-purple-500" },
}

const priorityConfig = {
  LOW: { label: "Low", color: "bg-gray-100 text-gray-800" },
  MEDIUM: { label: "Medium", color: "bg-blue-100 text-blue-800" },
  HIGH: { label: "High", color: "bg-orange-100 text-orange-800" },
  URGENT: { label: "Urgent", color: "bg-red-100 text-red-800" },
}

const statusConfig = {
  PENDING: { label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: <MdPending /> },
  IN_PROGRESS: { label: "In Progress", color: "bg-blue-100 text-blue-800", icon: <MdSchedule /> },
  COMPLETED: { label: "Completed", color: "bg-green-100 text-green-800", icon: <MdCheckCircle /> },
  CANCELLED: { label: "Cancelled", color: "bg-gray-100 text-gray-800", icon: <MdCancel /> },
}

export default function MaintenancePage() {
  const { isAuthenticated } = useAuth()
  const [attendants, setAttendants] = useState<Attendant[]>([])
  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    attendantId: "",
    taskType: "",
    description: "",
    scheduledDate: "",
    scheduledTime: "",
    estimatedDuration: "",
    priority: "MEDIUM",
    assignedPump: "",
    notes: ""
  })

  useEffect(() => {
    if (isAuthenticated) {
      fetchAttendants()
      fetchMaintenanceTasks()
    }
  }, [isAuthenticated])

  const fetchAttendants = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/attendants", {
        credentials: 'include'
      })
      const data = await res.json()
      setAttendants(data)
    } catch (err) {
      console.error("Failed to fetch attendants", err)
    }
  }

  const fetchMaintenanceTasks = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/maintenance", {
        credentials: 'include'
      })
      const data = await res.json()
      setMaintenanceTasks(data)
    } catch (err) {
      console.error("Failed to fetch maintenance tasks", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      const res = await fetch("http://localhost:5000/api/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({
          attendantId: Number(formData.attendantId),
          taskType: formData.taskType,
          description: formData.description,
          scheduledDate: formData.scheduledDate,
          scheduledTime: formData.scheduledTime,
          estimatedDuration: Number(formData.estimatedDuration),
          priority: formData.priority,
          assignedPump: formData.assignedPump,
          notes: formData.notes
        })
      })

      if (res.ok) {
        setSuccess("Maintenance task scheduled successfully!")
        resetForm()
        fetchMaintenanceTasks()
      } else {
        const errData = await res.json()
        setError(errData.message || "Failed to schedule maintenance")
      }
    } catch (err) {
      setError("Failed to schedule maintenance")
    }
  }

  const handleStatusUpdate = async (taskId: number, newStatus: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/maintenance/${taskId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      })

      if (res.ok) {
        setSuccess("Task status updated!")
        fetchMaintenanceTasks()
      } else {
        setError("Failed to update task status")
      }
    } catch (err) {
      setError("Failed to update task status")
    }
  }

  const resetForm = () => {
    setFormData({
      attendantId: "",
      taskType: "",
      description: "",
      scheduledDate: "",
      scheduledTime: "",
      estimatedDuration: "",
      priority: "MEDIUM",
      assignedPump: "",
      notes: ""
    })
    setShowForm(false)
  }

  const getTaskTypeDescription = (type: string) => {
    const descriptions = {
      PUMP_MAINTENANCE: "Regular maintenance of fuel pumps including cleaning, calibration, and inspection",
      TANK_CLEANING: "Cleaning and inspection of fuel storage tanks",
      EQUIPMENT_REPAIR: "Repair or replacement of malfunctioning equipment",
      SAFETY_CHECK: "Routine safety inspections and compliance checks",
      GENERAL: "General maintenance tasks and miscellaneous repairs"
    }
    return descriptions[type as keyof typeof descriptions] || ""
  }

  const upcomingTasks = maintenanceTasks.filter(task =>
    task.status === "PENDING" && new Date(task.scheduledDate) >= new Date()
  ).sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())

  const overdueTasks = maintenanceTasks.filter(task =>
    task.status === "PENDING" && new Date(task.scheduledDate) < new Date()
  )

  return (
      <div className="min-h-screen p-6 w-full bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl shadow-lg">
                <MdBuild className="text-3xl text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Maintenance Scheduling</h1>
                <p className="text-slate-600">Schedule and track maintenance tasks for attendants</p>
              </div>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg shadow-lg"
            >
              <MdAdd className="text-xl" />
              {showForm ? "Cancel" : "Schedule Maintenance"}
            </Button>
          </div>

          {error && <Alert variant="destructive" className="mb-6">{error}</Alert>}
          {success && <Alert variant="success" className="mb-6">{success}</Alert>}

          {/* Overdue Tasks Alert */}
          {overdueTasks.length > 0 && (
            <Card className="mb-6 p-4 bg-red-50 border-red-200">
              <div className="flex items-center gap-3">
                <MdWarning className="text-2xl text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-800">Overdue Maintenance Tasks</h3>
                  <p className="text-red-700">
                    {overdueTasks.length} task{overdueTasks.length > 1 ? 's' : ''} overdue: {overdueTasks.map(t => t.taskType.replace('_', ' ').toLowerCase()).join(', ')}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Schedule Form */}
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
                    <MdAdd className="text-orange-600" />
                    Schedule New Maintenance Task
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Attendant *</label>
                        <select
                          value={formData.attendantId}
                          onChange={(e) => setFormData({ ...formData, attendantId: e.target.value })}
                          required
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="">Select Attendant</option>
                          {attendants.map((att) => (
                            <option key={att.id} value={att.id}>{att.name} ({att.email})</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Task Type *</label>
                        <select
                          value={formData.taskType}
                          onChange={(e) => setFormData({ ...formData, taskType: e.target.value })}
                          required
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="">Select Task Type</option>
                          {Object.entries(taskTypeConfig).map(([key, config]) => (
                            <option key={key} value={key}>{config.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Scheduled Date *</label>
                        <input
                          type="date"
                          value={formData.scheduledDate}
                          onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                          required
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Scheduled Time *</label>
                        <input
                          type="time"
                          value={formData.scheduledTime}
                          onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                          required
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Estimated Duration (hours) *</label>
                        <input
                          type="number"
                          value={formData.estimatedDuration}
                          onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
                          placeholder="e.g., 2"
                          required
                          min="0.5"
                          step="0.5"
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
                        <select
                          value={formData.priority}
                          onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        >
                          {Object.entries(priorityConfig).map(([key, config]) => (
                            <option key={key} value={key}>{config.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Assigned Pump/Equipment</label>
                        <input
                          type="text"
                          value={formData.assignedPump}
                          onChange={(e) => setFormData({ ...formData, assignedPump: e.target.value })}
                          placeholder="e.g., Pump 1, Tank A"
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Task Description *</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        placeholder="Detailed description of the maintenance task..."
                        required
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                      {formData.taskType && (
                        <p className="text-xs text-slate-500 mt-1">
                          <strong>Suggestion:</strong> {getTaskTypeDescription(formData.taskType)}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Additional Notes</label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={2}
                        placeholder="Optional additional notes..."
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3">
                        Schedule Maintenance
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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
              <p className="mt-4 text-slate-600">Loading maintenance tasks...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Upcoming Tasks */}
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <MdSchedule className="text-orange-600" />
                  Upcoming Maintenance Tasks ({upcomingTasks.length})
                </h2>
                {upcomingTasks.length === 0 ? (
                  <Card className="p-8 text-center bg-white">
                    <MdSchedule className="text-5xl text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No upcoming maintenance tasks</p>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {upcomingTasks.map((task) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200"
                      >
                        <div className={`p-4 ${taskTypeConfig[task.taskType].color} text-white`}>
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="text-2xl mb-1">{taskTypeConfig[task.taskType].icon}</div>
                              <h3 className="font-bold text-lg">{taskTypeConfig[task.taskType].label}</h3>
                              <p className="text-sm opacity-90">{new Date(task.scheduledDate).toLocaleDateString()}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${priorityConfig[task.priority].color}`}>
                              {priorityConfig[task.priority].label}
                            </span>
                          </div>
                        </div>

                        <div className="p-4 space-y-3">
                          <div className="flex items-center gap-2 text-slate-700">
                            <MdPerson className="text-orange-600" />
                            <span className="font-semibold">{task.attendant?.name || "Unknown"}</span>
                          </div>

                          <div className="text-sm text-slate-600 space-y-1">
                            <div className="flex justify-between">
                              <span className="font-medium">Time:</span>
                              <span>{task.scheduledTime} ({task.estimatedDuration}h)</span>
                            </div>
                            {task.assignedPump && (
                              <div className="flex justify-between">
                                <span className="font-medium">Equipment:</span>
                                <span className="font-semibold text-orange-600">{task.assignedPump}</span>
                              </div>
                            )}
                          </div>

                          <p className="text-sm text-slate-700">{task.description}</p>

                          {task.notes && (
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-2">
                              <p className="text-xs text-amber-800"><strong>Notes:</strong> {task.notes}</p>
                            </div>
                          )}

                          <div className="flex gap-2 pt-2">
                            <Button
                              onClick={() => handleStatusUpdate(task.id, "IN_PROGRESS")}
                              className="flex-1 text-sm py-2 bg-blue-600 hover:bg-blue-700"
                            >
                              Start Task
                            </Button>
                            <Button
                              onClick={() => handleStatusUpdate(task.id, "COMPLETED")}
                              className="flex-1 text-sm py-2 bg-green-600 hover:bg-green-700"
                            >
                              Mark Complete
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* All Tasks History */}
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <MdBuild className="text-orange-600" />
                  Maintenance History
                </h2>
                <div className="space-y-3">
                  {maintenanceTasks
                    .filter(task => task.status !== "PENDING")
                    .sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime())
                    .map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white rounded-lg shadow-md p-4 border border-slate-200"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 ${taskTypeConfig[task.taskType].color} text-white rounded-lg`}>
                              <span className="text-xl">{taskTypeConfig[task.taskType].icon}</span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-900">
                                {taskTypeConfig[task.taskType].label} - {task.attendant?.name}
                              </h3>
                              <p className="text-sm text-slate-600">
                                {new Date(task.scheduledDate).toLocaleDateString()} at {task.scheduledTime}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-slate-700 mb-2">{task.description}</p>
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span>Duration: {task.estimatedDuration}h</span>
                            {task.assignedPump && <span>Equipment: {task.assignedPump}</span>}
                            {task.completedAt && <span>Completed: {new Date(task.completedAt).toLocaleDateString()}</span>}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig[task.status].color}`}>
                            {statusConfig[task.status].label}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${priorityConfig[task.priority].color}`}>
                            {priorityConfig[task.priority].label}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
  )
}
