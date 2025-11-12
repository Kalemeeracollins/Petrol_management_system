"use client";
import { useEffect, useMemo, useState } from "react";
import StatCard from "@/components/dashboard/stat-card";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/app/utils/cn";
import { motion } from "framer-motion";

interface AttendantStats {
  todaySales: number;
  totalLitersSold: number;
  activePump: string;
  shiftHours: number;
  shiftStatus: string;
  shiftStartTime: string | null;
}

export default function AttendantDashboard() {
  const { isAuthenticated, user, logout } = useAuth();
  const [stats, setStats] = useState<AttendantStats>({
    todaySales: 0,
    totalLitersSold: 0,
    activePump: "N/A",
    shiftHours: 0,
    shiftStatus: "OFF_DUTY",
    shiftStartTime: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Fetch real attendant data including shift status
  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }
      try {
        // Fetch attendant's current shift status
        const shiftResponse = await fetch("http://localhost:5000/api/shifts/my-shifts?status=IN_PROGRESS", {
          credentials: "include",
        });

        if (shiftResponse.ok) {
          const shifts = await shiftResponse.json();
          const activeShift = shifts.find((shift: any) => shift.status === "IN_PROGRESS");

          if (activeShift) {
            setStats(prev => ({
              ...prev,
              shiftStatus: "ON_DUTY",
              shiftStartTime: activeShift.actualStartTime,
              activePump: activeShift.assignedPump || "Pump 1",
            }));
          }
        }

        // Fetch today's sales data
        const salesResponse = await fetch("http://localhost:5000/api/sales/my-sales", {
          credentials: "include",
        });

        if (salesResponse.ok) {
          const sales = await salesResponse.json();
          const today = new Date().toISOString().split('T')[0];
          const todaySales = sales.filter((sale: any) => sale.saleDate.startsWith(today));

          const totalSales = todaySales.reduce((sum: number, sale: any) => sum + sale.totalAmount, 0);
          const totalLiters = todaySales.reduce((sum: number, sale: any) => sum + sale.quantitySold, 0);

          setStats(prev => ({
            ...prev,
            todaySales: totalSales,
            totalLitersSold: totalLiters,
          }));
        }

      } catch (err) {
        console.error("Failed to load attendant data:", err);
        setError("Failed to load attendant data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated]);

  const toggleTheme = () => setIsDarkMode((p) => !p);

  const quickActions = useMemo(
    () => [
      { label: "Record Sale", accent: "from-emerald-500 to-green-600" },
      { label: "View My Shift", accent: "from-blue-500 to-indigo-500" },
      { label: "Report Issue", accent: "from-rose-500 to-red-600" },
    ],
    []
  );

  return (
    <div
      className={cn(
        "min-h-screen",
        isDarkMode ? "dark bg-slate-950 text-slate-100" : "bg-slate-100 text-slate-900"
      )}
    >
      <div data-theme={isDarkMode ? "dark" : "light"}>
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="text-3xl font-semibold tracking-tight"
              >
                Attendant Dashboard
              </motion.h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Monitor your shift, pump status, and daily performance.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                onClick={toggleTheme}
                className={cn(
                  "shadow-lg",
                  isDarkMode
                    ? "border border-white/10 bg-slate-900/40 text-white hover:bg-slate-900/60"
                    : "border border-slate-200/60 bg-white/90 text-slate-800 hover:bg-white"
                )}
              >
                Switch to {isDarkMode ? "Light" : "Dark"} Mode
              </Button>
              <Button
                onClick={logout}
                variant="danger"
                className={cn(
                  "shadow-lg",
                  isDarkMode ? "shadow-red-900/40" : "shadow-red-400/30"
                )}
              >
                Logout
              </Button>
            </div>
          </div>

          {/* Alerts */}
          {error && <Alert variant="destructive">{error}</Alert>}
          {!isAuthenticated && (
            <Alert variant="warning">
              You’re in demo mode — connect to backend for live metrics.
            </Alert>
          )}

          {/* Stats */}
          <section
            className={cn(
              "grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4",
              isDarkMode ? "text-white" : "text-slate-900"
            )}
          >
            <StatCard
              title="Today's Sales (UGX)"
              value={loading ? "--" : stats.todaySales.toLocaleString()}
              icon={<span role="img" aria-label="money">💰</span>}
              trendLabel="+4.2%"
              trendValue="vs yesterday"
              dark={isDarkMode}
            />
            <StatCard
              title="Liters Sold"
              value={loading ? "--" : stats.totalLitersSold.toLocaleString()}
              icon={<span role="img" aria-label="fuel">⛽</span>}
              trendLabel="Consistent"
              trendValue="Steady flow"
              dark={isDarkMode}
            />
            <StatCard
              title="Active Pump"
              value={loading ? "--" : stats.activePump}
              icon={<span role="img" aria-label="pump">🔌</span>}
              trendLabel="Operational"
              trendValue="No faults"
              dark={isDarkMode}
            />
            <StatCard
              title="Shift Status"
              value={loading ? "--" : stats.shiftStatus === "ON_DUTY" ? "ON DUTY" : "OFF DUTY"}
              icon={<span role="img" aria-label="clock">🕒</span>}
              trendLabel={stats.shiftStatus === "ON_DUTY" ? "Active" : "Inactive"}
              trendValue={stats.shiftStatus === "ON_DUTY" ? "Shift ongoing" : "Start shift to sell"}
              dark={isDarkMode}
            />
          </section>

          {/* Alerts & Quick Actions */}
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <Card
              className={cn(
                "lg:col-span-3",
                isDarkMode
                  ? "bg-slate-900/50 text-slate-100 ring-1 ring-white/10"
                  : "bg-white/95 text-slate-900 ring-1 ring-slate-900/10"
              )}
            >
              <h2 className="text-lg font-semibold mb-4">Live Alerts</h2>
              <div className="space-y-3 text-sm">
                {stats.shiftStatus === "ON_DUTY" ? (
                  <Alert variant="success">
                    ✅ You are currently ON DUTY - Shift started at {stats.shiftStartTime ? new Date(stats.shiftStartTime).toLocaleTimeString() : "N/A"}
                  </Alert>
                ) : (
                  <Alert variant="warning">
                    ⚠️ You are currently OFF DUTY - Please start your shift to record sales
                  </Alert>
                )}
                <Alert variant="warning">Pump 3 pressure low — check valve.</Alert>
                <Alert variant="default">Next fuel delivery scheduled for 3:00 PM.</Alert>
              </div>
            </Card>

            <Card
              className={cn(
                "lg:col-span-2",
                isDarkMode
                  ? "bg-slate-900/50 text-slate-100 ring-1 ring-white/10"
                  : "bg-white/95 text-slate-900 ring-1 ring-slate-900/10"
              )}
            >
              <h2 className="text-lg font-semibold">Quick Actions</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    className={cn(
                      "group flex items-center justify-between overflow-hidden rounded-2xl bg-gradient-to-br px-4 py-3 text-left text-sm font-medium text-white shadow-lg transition-transform hover:-translate-y-1 hover:shadow-2xl",
                      action.accent
                    )}
                  >
                    <span>{action.label}</span>
                    <span
                      aria-hidden
                      className="text-lg transition-transform duration-300 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </button>
                ))}
              </div>
            </Card>
          </section>
        </div>
      </ div>
    </div>
  );
}
