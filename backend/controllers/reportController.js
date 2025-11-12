import Sale from "../models/Sale.js";
import Expense from "../models/Expense.js";
import FuelType from "../models/FuelType.js";
import Shift from "../models/Shift.js";
import User from "../models/User.js";
import { Op } from "sequelize";

export const getReport = async (req, res) => {
  try {
    const { period } = req.query;
    let startDate = new Date();
    if (period === "weekly") startDate.setDate(startDate.getDate() - 7);
    if (period === "monthly") startDate.setMonth(startDate.getMonth() - 1);

    const sales = await Sale.findAll({ where: { saleDate: { [Op.gte]: startDate } } });
    const expenses = await Expense.findAll({ where: { date: { [Op.gte]: startDate } } });

    const totalSales = sales.reduce((sum, s) => sum + s.totalAmount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const netRevenue = totalSales - totalExpenses;

    res.json({ totalSales, totalExpenses, netRevenue, period });
  } catch (error) {
    res.status(500).json({ message: "Error generating report" });
  }
};

// Get dashboard analytics data
export const getDashboardAnalytics = async (req, res) => {
  try {
    // Get total sales (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sales = await Sale.findAll({
      where: { createdAt: { [Op.gte]: thirtyDaysAgo } },
      include: [{ model: FuelType, as: "fuelType" }]
    });

    const totalSales = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalLitersSold = sales.reduce((sum, sale) => sum + sale.quantitySold, 0);

    // Get fuel inventory
    const fuels = await FuelType.findAll();
    const totalFuelInventory = fuels.reduce((sum, fuel) => sum + fuel.quantityInStock, 0);

    // Get active pumps (attendants with assigned pumps)
    const attendantsWithPumps = await User.count({
      where: { role: "attendant" }
    });

    // Get total attendants
    const totalAttendants = await User.count({
      where: { role: "attendant" }
    });

    // Get shift analytics
    const shifts = await Shift.findAll({
      where: { scheduledDate: { [Op.gte]: thirtyDaysAgo } }
    });

    const activeShifts = shifts.filter(shift => shift.status === "IN_PROGRESS").length;
    const completedShifts = shifts.filter(shift => shift.status === "COMPLETED").length;
    const missedShifts = shifts.filter(shift => shift.status === "MISSED").length;

    // Generate alerts
    const alerts = [];

    // Low stock alerts
    const lowStockFuels = fuels.filter(fuel => fuel.quantityInStock < 1000); // Less than 1000L
    lowStockFuels.forEach(fuel => {
      alerts.push({
        type: "warning",
        message: `${fuel.name} inventory is low (${fuel.quantityInStock}L remaining)`,
        priority: "high"
      });
    });

    // Missed shifts alert
    if (missedShifts > 0) {
      alerts.push({
        type: "error",
        message: `${missedShifts} shifts were missed this month`,
        priority: "high"
      });
    }

    // No active shifts alert
    if (activeShifts === 0) {
      alerts.push({
        type: "info",
        message: "No shifts are currently active",
        priority: "medium"
      });
    }

    // Sales trend (last 7 days vs previous 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const recentSales = sales.filter(sale => sale.createdAt >= sevenDaysAgo);
    const previousSales = sales.filter(sale =>
      sale.createdAt >= fourteenDaysAgo && sale.createdAt < sevenDaysAgo
    );

    const recentTotal = recentSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const previousTotal = previousSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const salesTrend = previousTotal > 0 ? ((recentTotal - previousTotal) / previousTotal) * 100 : 0;

    // Sales chart data (last 7 days)
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const daySales = sales.filter(sale => {
        const saleDate = new Date(sale.createdAt).toDateString();
        return saleDate === date.toDateString();
      });
      const dayTotal = daySales.reduce((sum, sale) => sum + sale.totalAmount, 0);
      chartData.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        sales: dayTotal
      });
    }

    res.json({
      stats: {
        totalSales,
        totalLitersSold,
        fuelInventory: totalFuelInventory,
        activePumps: attendantsWithPumps,
        attendants: totalAttendants,
        activeShifts,
        completedShifts,
        missedShifts,
        salesTrend
      },
      alerts,
      chartData
    });
  } catch (error) {
    console.error("Error fetching dashboard analytics:", error);
    res.status(500).json({ message: "Error fetching dashboard data" });
  }
};
