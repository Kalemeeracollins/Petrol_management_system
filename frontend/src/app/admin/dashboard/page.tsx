"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import StatCard from "@/components/dashboard/stat-card";
import SalesChart from "@/components/dashboard/sales-chart";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { useTheme } from "@/context/theme-context";
import { cn } from "@/app/utils/cn";
import { motion, AnimatePresence } from "framer-motion";

// ==============================
// Interfaces
// ==============================
interface DashboardStats {
  totalSales: number;
  totalLitersSold: number;
  fuelInventory: number;
  activePumps: number;
  attendants: number;
  activeShifts: number;
  completedShifts: number;
  missedShifts: number;
  salesTrend: number;
}

interface AlertItem {
  type: "warning" | "error" | "info";
  message: string;
  priority: "high" | "medium" | "low";
}

interface DashboardData {
  stats: DashboardStats;
  alerts: AlertItem[];
  chartData: { date: string; sales: number }[];
}

// ==============================
// Floating Toggle Menu Component
// ==============================
const QuickMenu = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { label: "Dashboard", href: "/admin/dashboard", icon: "📊" },
    { label: "Fuel Management", href: "/admin/fuel-management", icon: "⛽" },
    { label: "Sales Records", href: "/admin/sales-records", icon: "💰" },
    { label: "Reports", href: "/admin/reports", icon: "📄" },
    { label: "Assign Shift", href: "/admin/shifts", icon: "👥" },
    { label: "Settings", href: "/admin/settings", icon: "⚙️" },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Toggle Button */}
      <Button
        variant="secondary"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full text-2xl flex items-center justify-center shadow-lg",
          isDarkMode
            ? "bg-slate-900 text-white hover:bg-slate-800 border border-white/10"
            : "bg-white text-slate-900 hover:bg-slate-200 border border-slate-300"
        )}
      >
        ☰
      </Button>

      {/* Animated Popup Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.18 }}
            className={cn(
              "w-52 rounded-2xl shadow-xl overflow-hidden ring-1 ring-black/10",
              isDarkMode ? "bg-slate-900 text-white" : "bg-white text-slate-900"
            )}
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors",
                  isDarkMode
                    ? "hover:bg-indigo-600 hover:text-white"
                    : "hover:bg-indigo-100 hover:text-indigo-700"
                )}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ==============================
// Main Dashboard Page
// ==============================
export default function DashboardPage() {
  const { isAuthenticated, user, logout, register } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalLitersSold: 0,
    fuelInventory: 0,
    activePumps: 0,
    attendants: 0,
    activeShifts: 0,
    completedShifts: 0,
    missedShifts: 0,
    salesTrend: 0,
  });
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState("attendant");
  const [registerError, setRegisterError] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);
  const isDarkMode = theme === "dark";
  const [users, setUsers] = useState<any[]>([]);
  const [userManagementLoading, setUserManagementLoading] = useState(false);

  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        setError("User not authenticated");
        return;
      }
      try {
        const response = await fetch("http://localhost:5000/api/reports/dashboard", {
          credentials: "include",
        });
        const data: DashboardData = await response.json();
        if (response.ok) {
          setStats(data.stats);
          setAlerts(data.alerts);
        } else {
          // fallback
          throw new Error("Dashboard response not ok");
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Failed to fetch dashboard data (using demo values)");
        // fallback demo values
        setStats({
          totalSales: 1284,
          totalLitersSold: 2450,
          fuelInventory: 48750,
          activePumps: 12,
          attendants: 28,
          activeShifts: 5,
          completedShifts: 23,
          missedShifts: 2,
          salesTrend: 8.4,
        });
        setAlerts([
          { type: "warning", message: "Super 95 inventory dipped below 20%", priority: "high" },
          { type: "info", message: "New compliance report ready for review", priority: "medium" },
          { type: "info", message: "Pump 3 maintenance completed", priority: "low" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated]);

  // Quick Actions with links
  const quickActions = useMemo(
    () => [
      {
        label: "Restock Premium",
        href: "/admin/restock",
        icon: "⛽",
        accent: "from-sky-400 to-cyan-500",
      },
      {
        label: "Schedule Maintenance",
        href: "/admin/maintenance",
        icon: "⚙️",
        accent: "from-amber-400 to-orange-500",
      },
      {
        label: "Assign Shift",
        href: "/admin/shifts",
        icon: "👥",
        accent: "from-emerald-400 to-teal-500",
      },
    ],
    []
  );

  // Fetch users for admin
  useEffect(() => {
    const fetchUsers = async () => {
      if (!isAuthenticated || user?.role !== "ADMIN") return;
      try {
        const response = await fetch("http://localhost:5000/api/users", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    fetchUsers();
  }, [isAuthenticated, user]);

  // Register a new user
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError("");
    setRegisterLoading(true);
    try {
      await register(newUserName, newUserEmail, newUserPassword, newUserRole);
      setNewUserName("");
      setNewUserEmail("");
      setNewUserPassword("");
      setNewUserRole("attendant");
      alert("User registered successfully!");
      // refresh
      const response = await fetch("http://localhost:5000/api/users", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (err: any) {
      setRegisterError(err?.message || "Registration failed");
    } finally {
      setRegisterLoading(false);
    }
  };

  // Toggle user status
  const handleToggleUserStatus = async (userId: number) => {
    setUserManagementLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}/toggle-status`, {
        method: "PUT",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        alert(data.message || "User status updated");
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, active: !u.active } : u)));
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to update user status");
      }
    } catch (err) {
      console.error("Failed to toggle user status:", err);
      alert("Failed to update user status");
    } finally {
      setUserManagementLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-300",
        isDarkMode ? "dark bg-slate-950 text-slate-100" : "bg-slate-100 text-slate-900"
      )}
    >
      <div variant={isDarkMode ? "dark" : "light"}>
        <div className="flex flex-col gap-6 p-6">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="text-3xl font-semibold tracking-tight"
              >
                Admin Command Center
              </motion.h1>
              <p className="mt-2 max-w-xl text-sm text-slate-600 dark:text-slate-400">
                Real-time insight into fuel operations, pump performance, and team coordination.
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
                className={cn(isDarkMode ? "shadow-red-900/40" : "shadow-red-400/30")}
              >
                Logout
              </Button>
            </div>
          </div>

          {/* Alerts */}
          {error && <Alert variant="destructive">{error}</Alert>}
          {!isAuthenticated && (
            <Alert variant="warning">
              Your session is in demo mode. Connect to the production backend to enable live metrics.
            </Alert>
          )}

          {/* Stats Section */}
          <section
            className={cn(
              "grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4",
              isDarkMode ? "text-white" : "text-slate-900"
            )}
          >
            <StatCard
              title="Total Sales"
              value={loading ? "--" : `UGX.${stats.totalSales.toFixed(2)}`}
              icon={<span role="img" aria-label="Money">💰</span>}
              trendLabel={`${stats.salesTrend >= 0 ? "+" : ""}${stats.salesTrend.toFixed(1)}%`}
              trendValue="vs last week"
              dark={isDarkMode}
            />
            <StatCard
              title="Fuel Inventory (L)"
              value={loading ? "--" : stats.fuelInventory.toLocaleString()}
              icon={<span role="img" aria-label="Fuel">⛽</span>}
              trendLabel="Stable"
              trendValue="2% variance"
              dark={isDarkMode}
            />
            <StatCard
              title="Active Shifts"
              value={loading ? "--" : stats.activeShifts}
              icon={<span role="img" aria-label="Shift">⏰</span>}
              trendLabel={`${stats.completedShifts} completed`}
              trendValue="this month"
              dark={isDarkMode}
            />
            <StatCard
              title="Attendants"
              value={loading ? "--" : stats.attendants}
              icon={<span role="img" aria-label="Team">👥</span>}
              trendLabel={`${stats.missedShifts} missed`}
              trendValue="shifts"
              dark={isDarkMode}
            />
          </section>

          {/* Charts and Quick Actions */}
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <Card
              className={cn(
                "lg:col-span-3",
                isDarkMode ? "bg-slate-900/50 text-slate-100 ring-1 ring-white/10" : "bg-white/95 text-slate-900 ring-1 ring-slate-900/10"
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">Weekly Sales Overview</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-300">
                    Monitoring weekly throughput across all stations
                  </p>
                </div>
                <Button
                  variant="ghost"
                  className={cn(
                    "rounded-full px-4 py-2",
                    isDarkMode ? "text-white hover:bg-white/10" : "text-slate-600 hover:bg-slate-100"
                  )}
                >
                  Download Report
                </Button>
              </div>
              <div className="mt-6">
                <SalesChart dark={isDarkMode} />
              </div>
            </Card>

            <div className="space-y-6 lg:col-span-2">
              <Card
                className={cn(
                  isDarkMode ? "bg-slate-900/50 text-slate-100 ring-1 ring-white/12" : "bg-white/95 text-slate-900 ring-1 ring-slate-200/60"
                )}
              >
                <h2 className="text-lg font-semibold">Live Alerts</h2>
                <div className="mt-4 space-y-3 text-sm leading-relaxed">
                  {alerts.length > 0 ? (
                    alerts.map((a, i) => (
                      <Alert
                        key={i}
                        variant={a.type === "warning" ? "warning" : a.type === "error" ? "destructive" : "default"}
                      >
                        {a.message}
                      </Alert>
                    ))
                  ) : (
                    <>
                      <Alert variant="warning">Super 95 inventory dipped below 20%</Alert>
                      <Alert variant="default">New compliance report ready for review</Alert>
                      <Alert variant="success">Pump 3 maintenance completed</Alert>
                    </>
                  )}
                </div>
              </Card>

              <Card
                className={cn(
                  isDarkMode ? "bg-slate-900/50 text-slate-100 ring-1 ring-white/12" : "bg-white/95 text-slate-900 ring-1 ring-slate-200/60"
                )}
              >
                <h2 className="text-lg font-semibold">Quick Actions</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {quickActions.map((action) => (
                    <Link
                      key={action.label}
                      href={action.href}
                      className={cn(
                        "group flex items-center justify-between overflow-hidden rounded-2xl bg-gradient-to-br px-4 py-3 text-left text-sm font-medium text-white shadow-lg transition-transform hover:-translate-y-1 hover:shadow-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                        action.accent
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <span aria-hidden>{action.icon}</span>
                        <span>{action.label}</span>
                      </span>
                      <span aria-hidden className="text-lg transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                  ))}
                </div>
              </Card>
            </div>
          </section>

          {/* User Management Section (Admin only) */}
          {user?.role === "ADMIN" && (
            <>
              {/* User Management Table */}
              <Card
                className={cn(
                  isDarkMode ? "bg-slate-900/50 text-slate-100 ring-1 ring-white/12" : "bg-white/95 text-slate-900 ring-1 ring-slate-200/60"
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">User Management</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Manage team members and their access status.</p>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700">
                          <th className="text-left py-2 px-4">Name</th>
                          <th className="text-left py-2 px-4">Email</th>
                          <th className="text-left py-2 px-4">Role</th>
                          <th className="text-left py-2 px-4">Status</th>
                          <th className="text-left py-2 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-4 px-4 text-center text-sm text-slate-500">
                              No users found.
                            </td>
                          </tr>
                        ) : (
                          users.map((u) => (
                            <tr key={u.id} className="border-b border-slate-100 dark:border-slate-800">
                              <td className="py-2 px-4">{u.name}</td>
                              <td className="py-2 px-4">{u.email}</td>
                              <td className="py-2 px-4 capitalize">{u.role}</td>
                              <td className="py-2 px-4">
                                <span
                                  className={cn(
                                    "px-2 py-1 rounded-full text-xs",
                                    u.active
                                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                  )}
                                >
                                  {u.active ? "Active" : "Inactive"}
                                </span>
                              </td>
                              <td className="py-2 px-4">
                                <Button
                                  onClick={() => handleToggleUserStatus(u.id)}
                                  disabled={userManagementLoading}
                                  variant={u.active ? "danger" : "default"}
                                  size="sm"
                                >
                                  {u.active ? "Deactivate" : "Activate"}
                                </Button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Card>

              {/* Register New User */}
              <Card
                className={cn(
                  isDarkMode ? "bg-slate-900/50 text-slate-100 ring-1 ring-white/12" : "bg-white/95 text-slate-900 ring-1 ring-slate-200/60"
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">Register New Team Member</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Provision secure platform access for operations staff.</p>
                  </div>
                  <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300">Role: {user.role}</div>
                </div>

                {registerError && (
                  <div className="mt-4">
                    <Alert variant="destructive">{registerError}</Alert>
                  </div>
                )}

                <form onSubmit={handleRegister} className="mt-6 grid gap-4 md:grid-cols-2">
                  <label className="flex flex-col gap-2">
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Full Name</span>
                    <input
                      type="text"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      required
                      placeholder="Full name"
                      autoComplete="name"
                      className="rounded-xl border border-slate-200/60 bg-white/90 px-4 py-2 text-sm text-slate-900 shadow-inner transition-shadow focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 dark:border-white/10 dark:bg-slate-900/50 dark:text-white"
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Email</span>
                    <input
                      type="email"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      required
                      placeholder="email@fuelhq.io"
                      autoComplete="email"
                      className="rounded-xl border border-slate-200/60 bg-white/90 px-4 py-2 text-sm text-slate-900 shadow-inner transition-shadow focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 dark:border-white/10 dark:bg-slate-900/50 dark:text-white"
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Password</span>
                    <input
                      type="password"
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      required
                      placeholder="Secure password"
                      autoComplete="new-password"
                      className="rounded-xl border border-slate-200/60 bg-white/90 px-4 py-2 text-sm text-slate-900 shadow-inner transition-shadow focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 dark:border-white/10 dark:bg-slate-900/50 dark:text-white"
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Role</span>
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value)}
                      className="rounded-xl border border-slate-200/60 bg-white/90 px-4 py-2 text-sm text-slate-900 shadow-inner transition-shadow focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 dark:border-white/10 dark:bg-slate-900/50 dark:text-white"
                    >
                      <option value="attendant">Attendant</option>
                      <option value="admin">Admin</option>
                    </select>
                  </label>

                  <div className="flex justify-end md:col-span-2">
                    <Button
                      type="submit"
                      className={cn("w-full md:w-auto", isDarkMode ? "shadow-indigo-900/40" : "shadow-indigo-200/60")}
                      disabled={registerLoading}
                    >
                      {registerLoading ? "Registering..." : "Register User"}
                    </Button>
                  </div>
                </form>
              </Card>
            </>
          )}
        </div>

        {/* Floating Toggle Menu */}
        <QuickMenu isDarkMode={isDarkMode} />
      </div>
    </div>
  );
}
