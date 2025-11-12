// app/attendant-shifts/page.tsx
"use client";

import { useEffect, useState } from "react";
import { MdAccessTime, MdCheckCircle, MdSchedule, MdWarning, MdCancel, MdPlayArrow, MdStop, MdInfo, MdLocalGasStation } from "react-icons/md";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";

interface Shift {
  id: number;
  shiftType: "MORNING" | "AFTERNOON" | "NIGHT";
  scheduledDate: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  actualStartTime?: string;
  actualEndTime?: string;
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "MISSED" | "CANCELLED";
  description?: string;
  assignedPump?: string;
  notes?: string;
  duration?: number;
  overtime?: boolean;
  priority?: string;
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

export default function AttendantShiftsPage() {
  const { user, isAuthenticated } = useAuth()
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeShift, setActiveShift] = useState<Shift | null>(null);
  const [historicalShifts, setHistoricalShifts] = useState<Shift[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [myPump, setMyPump] = useState<any>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchShifts();
      fetchMyPump();
    }
  }, [isAuthenticated]);

  const fetchShifts = async () => {
    setError("");
    try {
      const response = await fetch("http://localhost:5000/api/shifts/my-shifts", {
        credentials: 'include',
      });
      if (!response.ok) throw new Error("Failed to fetch shifts");
      const data = await response.json();

      const active = data.find((shift: Shift) => shift.status === "IN_PROGRESS");
      const historical = data.filter((shift: Shift) => shift.status !== "IN_PROGRESS");

      setActiveShift(active || null);
      setHistoricalShifts(historical);
      setShifts(data);
    } catch (err) {
      console.error("Failed to fetch shifts");
      setError("Failed to load shifts");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyPump = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/attendants/me", {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setMyPump(data);
      }
    } catch (err) {
      console.error("Failed to fetch pump info");
    }
  };

  const handleStartShift = async (shiftId: number) => {
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`http://localhost:5000/api/shifts/start/${shiftId}`, {
        method: "PUT",
        credentials: 'include',
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to start shift");
      }

      const data = await res.json();
      setSuccess(data.message || "Shift started successfully");
      await fetchShifts(); // Refresh data
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to start shift");
    }
  };

  const handleEndShift = async (shiftId: number) => {
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`http://localhost:5000/api/shifts/end/${shiftId}`, {
        method: "PUT",
        credentials: 'include',
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMessage = errorData.message || "Failed to end shift";
        throw new Error(errorMessage);
      }

      const data = await res.json();
      setSuccess(data.message || "Shift ended successfully");
      await fetchShifts(); // Refresh data
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to end shift");
    }
  };

  const handleCancelShift = async (shiftId: number) => {
    if (!confirm("Are you sure you want to cancel this shift?")) return;

    setError("");
    setSuccess("");
    try {
      const res = await fetch(`http://localhost:5000/api/shifts/cancel/${shiftId}`, {
        method: "PUT",
        credentials: 'include',
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to cancel shift");
      }

      const data = await res.json();
      setSuccess(data.message || "Shift cancelled successfully");
      await fetchShifts(); // Refresh data
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to cancel shift");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="min-h-screen p-6 w-full bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl shadow-lg">
              <MdSchedule className="text-3xl text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">My Shifts</h1>
              <p className="text-slate-600">Manage your scheduled and completed shifts</p>
            </div>
          </div>

          {error && <div className="mb-6 bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">{error}</div>}
          {success && <div className="mb-6 bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg">{success}</div>}

          {/* My Pump Section */}
          {myPump && myPump.pumpNumber && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-600 rounded-lg">
                    <MdLocalGasStation className="text-2xl text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-blue-800">My Pump Assignment</h2>
                    <p className="text-blue-600">Current pump station</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <MdCheckCircle className="text-blue-600" />
                  <span className="text-sm text-blue-700">Assigned</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-500">Pump Number</div>
                  <div className="font-semibold text-lg">{myPump.pumpNumber}</div>
                </div>
                {myPump.pumpName && (
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-sm text-gray-500">Pump Name</div>
                    <div className="font-semibold text-lg">{myPump.pumpName}</div>
                  </div>
                )}
                {myPump.pumpAssignedAt && (
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-sm text-gray-500">Assigned Date</div>
                    <div className="font-semibold text-lg">{new Date(myPump.pumpAssignedAt).toLocaleDateString()}</div>
                  </div>
                )}
              </div>

              {myPump.pumpNotes && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-sm text-amber-800"><strong>Notes:</strong> {myPump.pumpNotes}</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Active Shift Section */}
          {activeShift && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">⚡</div>
                  <div>
                    <h2 className="text-xl font-semibold text-green-800">Active Shift</h2>
                    <p className="text-green-600">Currently working</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <MdAccessTime className="text-green-600" />
                  <span className="text-sm text-green-700">In Progress</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-500">Shift Type</div>
                  <div className="font-semibold text-lg">{shiftTypeConfig[activeShift.shiftType]?.label}</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-500">Date</div>
                  <div className="font-semibold text-lg">{new Date(activeShift.scheduledDate).toLocaleDateString()}</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-500">Time</div>
                  <div className="font-semibold text-lg">
                    {activeShift.scheduledStartTime} - {activeShift.scheduledEndTime}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Started:</span> {activeShift.actualStartTime ? new Date(activeShift.actualStartTime).toLocaleTimeString() : 'N/A'}
                </div>
                <Button
                  onClick={() => handleEndShift(activeShift.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2"
                >
                  <MdStop className="mr-2" /> End Shift
                </Button>
              </div>
            </motion.div>
          )}

          {/* Historical Shifts Section */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Shift History</h2>

            {historicalShifts.length === 0 ? (
              <Card className="p-12 text-center bg-slate-50">
                <MdSchedule className="text-6xl text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-700 mb-2">No Historical Shifts</h3>
                <p className="text-slate-500">Your completed shifts will appear here</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {historicalShifts.map((shift) => (
                    <motion.div
                      key={shift.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">{shiftTypeConfig[shift.shiftType]?.icon}</div>
                            <div>
                              <h3 className="font-semibold text-lg text-slate-900">
                                {shiftTypeConfig[shift.shiftType]?.label}
                              </h3>
                              <p className="text-sm text-slate-500">
                                {new Date(shift.scheduledDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${statusConfig[shift.status]?.color}`}>
                            {statusConfig[shift.status]?.icon}
                            <span>{statusConfig[shift.status]?.label}</span>
                          </div>
                        </div>

                        <div className="space-y-3 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Scheduled:</span>
                            <span className="font-medium">
                              {shift.scheduledStartTime} - {shift.scheduledEndTime}
                            </span>
                          </div>

                          {shift.actualStartTime && (
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-500">Clocked In:</span>
                              <span className="font-medium">
                                {new Date(shift.actualStartTime).toLocaleTimeString()}
                              </span>
                            </div>
                          )}

                          {shift.actualEndTime && (
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-500">Clocked Out:</span>
                              <span className="font-medium">
                                {new Date(shift.actualEndTime).toLocaleTimeString()}
                              </span>
                            </div>
                          )}

                          {shift.duration && (
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-500">Duration:</span>
                              <span className="font-medium">
                                {Math.floor(shift.duration / 60)}h {shift.duration % 60}m
                                {shift.overtime && <span className="text-orange-600 ml-1">(OT)</span>}
                              </span>
                            </div>
                          )}

                          {shift.assignedPump && (
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-500">Pump:</span>
                              <span className="font-medium">{shift.assignedPump}</span>
                            </div>
                          )}
                        </div>

                        {shift.description && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                            <p className="text-sm text-blue-800">
                              <MdInfo className="inline mr-1" />
                              {shift.description}
                            </p>
                          </div>
                        )}

                        {shift.notes && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <p className="text-sm text-yellow-800">
                              <strong>Notes:</strong> {shift.notes}
                            </p>
                          </div>
                        )}

                        {shift.status === "SCHEDULED" && (
                          <div className="flex gap-2 mt-4">
                            <Button
                              onClick={() => handleStartShift(shift.id)}
                              className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                            >
                              <MdPlayArrow className="mr-2" /> Start Shift
                            </Button>
                            <Button
                              onClick={() => handleCancelShift(shift.id)}
                              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                            >
                              <MdCancel className="mr-2" /> Cancel Shift
                            </Button>
                          </div>
                        )}
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
      </div>
      </div>
    </div>
  );
}
