"use client"

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface ChartData {
  date: string;
  sales: number;
}

interface SalesChartProps {
  dark?: boolean;
}

export default function SalesChart({ dark = false }: SalesChartProps) {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/reports/dashboard", {
          credentials: 'include',
        });
        const result = await response.json();
        if (response.ok) {
          setData(result.chartData || []);
        } else {
          // Fallback to mock data if API fails
          setData([
            { date: "Mon", sales: 2400 },
            { date: "Tue", sales: 2210 },
            { date: "Wed", sales: 2290 },
            { date: "Thu", sales: 2000 },
            { date: "Fri", sales: 2181 },
            { date: "Sat", sales: 2500 },
            { date: "Sun", sales: 2100 },
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
        // Fallback to mock data
        setData([
          { date: "Mon", sales: 2400 },
          { date: "Tue", sales: 2210 },
          { date: "Wed", sales: 2290 },
          { date: "Thu", sales: 2000 },
          { date: "Fri", sales: 2181 },
          { date: "Sat", sales: 2500 },
          { date: "Sun", sales: 2100 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <div className="text-slate-500">Loading chart data...</div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={dark ? "#374151" : "#e2e8f0"}
        />
        <XAxis
          dataKey="date"
          stroke={dark ? "#9ca3af" : "#64748b"}
        />
        <YAxis
          stroke={dark ? "#9ca3af" : "#64748b"}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: dark ? "#1f2937" : "#f1f5f9",
            border: `1px solid ${dark ? "#374151" : "#cbd5e1"}`,
            color: dark ? "#f9fafb" : "#1e293b"
          }}
          labelStyle={{ color: dark ? "#f9fafb" : "#1e293b" }}
          formatter={(value: number) => [`$${value.toFixed(2)}`, "Sales"]}
        />
        <Line
          type="monotone"
          dataKey="sales"
          stroke="#2563eb"
          strokeWidth={2}
          dot={{ fill: "#2563eb" }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
