import Shift from "../models/Shift.js";
import User from "../models/User.js";
import { Op } from "sequelize";

// Creative helper: Check for shift conflicts
const checkShiftConflict = async (attendantId, scheduledDate, scheduledStartTime, scheduledEndTime, excludeShiftId = null) => {
  const whereClause = {
    attendantId,
    scheduledDate,
    [Op.or]: [
      {
        scheduledStartTime: { [Op.lt]: scheduledEndTime },
        scheduledEndTime: { [Op.gt]: scheduledStartTime }
      }
    ]
  };

  if (excludeShiftId) {
    whereClause.id = { [Op.ne]: excludeShiftId };
  }

  const conflictingShifts = await Shift.findAll({ where: whereClause });
  return conflictingShifts.length > 0;
};

// Admin: Create/assign a shift
export const createShift = async (req, res) => {
  try {
    const { attendantId, shiftType, scheduledDate, scheduledStartTime, scheduledEndTime, description, assignedPump, priority = "MEDIUM" } = req.body;

    // Validate attendant exists
    const attendant = await User.findByPk(attendantId);
    if (!attendant) {
      return res.status(404).json({ message: "Attendant not found" });
    }

    // Creative: Check for conflicts
    const hasConflict = await checkShiftConflict(attendantId, scheduledDate, scheduledStartTime, scheduledEndTime);
    if (hasConflict) {
      return res.status(409).json({ message: "Shift conflicts with existing schedule" });
    }

    // Create shift in dedicated table
    const shift = await Shift.create({
      attendantId,
      shiftType,
      scheduledDate,
      scheduledStartTime,
      scheduledEndTime,
      description,
      assignedPump,
      priority
    });

    // Fetch with attendant data
    const shiftWithAttendant = await Shift.findByPk(shift.id, {
      include: [{ model: User, as: "attendant", attributes: ["id", "name", "email"] }]
    });

    res.status(201).json({ message: "Shift assigned successfully", shift: shiftWithAttendant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating shift" });
  }
};

// Get all shifts (Admin)
export const getAllShifts = async (req, res) => {
  try {
    const { status, date, attendantId, shiftType, priority } = req.query;
    const where = {};

    if (status) where.status = status;
    if (date) where.scheduledDate = date;
    if (attendantId) where.attendantId = attendantId;
    if (shiftType) where.shiftType = shiftType;
    if (priority) where.priority = priority;

    // Efficient query with includes and ordering
    const shifts = await Shift.findAll({
      where,
      include: [{ model: User, as: "attendant", attributes: ["id", "name", "email"] }],
      order: [["scheduledDate", "DESC"], ["scheduledStartTime", "ASC"]]
    });

    res.json(shifts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching shifts" });
  }
};

// Get shifts for a specific attendant
export const getAttendantShifts = async (req, res) => {
  try {
    const attendantId = req.user.id;
    const { status, upcoming } = req.query;

    const where = { attendantId };

    if (status) where.status = status;
    if (upcoming === "true") {
      where.scheduledDate = { [Op.gte]: new Date().toISOString().split('T')[0] };
    }

    // Efficient query using dedicated shifts table
    const shifts = await Shift.findAll({
      where,
      include: [{ model: User, as: "attendant", attributes: ["id", "name", "email"] }],
      order: [["scheduledDate", "DESC"], ["scheduledStartTime", "ASC"]]
    });

    res.json(shifts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching shifts" });
  }
};

// Start a shift (Attendant clocks in)
export const startShift = async (req, res) => {
  try {
    const { shiftId } = req.params;
    const shift = await Shift.findByPk(shiftId, {
      include: [{ model: User, as: "attendant", attributes: ["id", "name", "email"] }]
    });

    if (!shift) return res.status(404).json({ message: "Shift not found" });
    if (shift.attendantId !== req.user.id) return res.status(403).json({ message: "Not your shift" });
    if (shift.status !== "SCHEDULED") return res.status(400).json({ message: "Shift already started or completed" });

    // Creative: Check if starting too early (more than 30 min before)
    const scheduledStart = new Date(`${shift.scheduledDate}T${shift.scheduledStartTime}`);
    const now = new Date();
    const diffMinutes = (scheduledStart - now) / (1000 * 60);
    if (diffMinutes > 30) {
      return res.status(400).json({ message: "Cannot start shift more than 30 minutes early" });
    }

    shift.actualStartTime = now;
    shift.status = "IN_PROGRESS";
    await shift.save();

    res.json({ message: "Shift started successfully", shift });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error starting shift" });
  }
};

// End a shift (Attendant clocks out)
export const endShift = async (req, res) => {
  try {
    const { shiftId } = req.params;
    const { notes } = req.body;

    const shift = await Shift.findByPk(shiftId, {
      include: [{ model: User, as: "attendant", attributes: ["id", "name", "email"] }]
    });

    if (!shift) return res.status(404).json({ message: "Shift not found" });
    if (shift.attendantId !== req.user.id) return res.status(403).json({ message: "Not your shift" });
    if (shift.status !== "IN_PROGRESS") return res.status(400).json({ message: "Shift not in progress" });

    const now = new Date();
    shift.actualEndTime = now;
    shift.status = "COMPLETED";
    if (notes) shift.notes = notes;

    // Creative: Calculate actual worked hours and overtime
    if (shift.actualStartTime) {
      const workedMinutes = (now - shift.actualStartTime) / (1000 * 60);
      shift.duration = Math.round(workedMinutes);
      if (workedMinutes > 480) { // More than 8 hours
        shift.overtime = true;
      }
    }

    await shift.save();

    res.json({ message: "Shift ended successfully", shift });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error ending shift" });
  }
};

// Update shift (Admin only)
export const updateShift = async (req, res) => {
  try {
    const { shiftId } = req.params;
    const updates = req.body;

    const shift = await Shift.findByPk(shiftId);
    if (!shift) return res.status(404).json({ message: "Shift not found" });

    // Creative: Check for conflicts if updating time/date
    if (updates.scheduledDate || updates.scheduledStartTime || updates.scheduledEndTime) {
      const hasConflict = await checkShiftConflict(
        shift.attendantId,
        updates.scheduledDate || shift.scheduledDate,
        updates.scheduledStartTime || shift.scheduledStartTime,
        updates.scheduledEndTime || shift.scheduledEndTime,
        shiftId
      );
      if (hasConflict) {
        return res.status(409).json({ message: "Updated shift conflicts with existing schedule" });
      }
    }

    await shift.update(updates);

    const updatedShift = await Shift.findByPk(shiftId, {
      include: [{ model: User, as: "attendant", attributes: ["id", "name", "email"] }]
    });

    res.json({ message: "Shift updated successfully", shift: updatedShift });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating shift" });
  }
};

// Delete shift (Admin only)
export const deleteShift = async (req, res) => {
  try {
    const { shiftId } = req.params;
    const shift = await Shift.findByPk(shiftId);

    if (!shift) return res.status(404).json({ message: "Shift not found" });

    // Creative: Prevent deletion of in-progress or completed shifts
    if (shift.status === "IN_PROGRESS" || shift.status === "COMPLETED") {
      return res.status(400).json({ message: "Cannot delete active or completed shifts" });
    }

    await shift.destroy();

    res.json({ message: "Shift deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting shift" });
  }
};

// Mark shift as missed (Auto or Admin)
export const markShiftMissed = async (req, res) => {
  try {
    const { shiftId } = req.params;
    const shift = await Shift.findByPk(shiftId, {
      include: [{ model: User, as: "attendant", attributes: ["id", "name", "email"] }]
    });

    if (!shift) return res.status(404).json({ message: "Shift not found" });
    if (shift.status !== "SCHEDULED") return res.status(400).json({ message: "Cannot mark as missed" });

    shift.status = "MISSED";
    await shift.save();

    res.json({ message: "Shift marked as missed", shift });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error marking shift as missed" });
  }
};

// Creative: Auto-mark missed shifts (to be called by a cron job or scheduler)
export const autoMarkMissedShifts = async () => {
  try {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    // Find scheduled shifts that ended yesterday and weren't started
    const missedShifts = await Shift.findAll({
      where: {
        status: "SCHEDULED",
        scheduledDate: { [Op.lt]: yesterday.toISOString().split('T')[0] }
      }
    });

    for (const shift of missedShifts) {
      shift.status = "MISSED";
      await shift.save();
      console.log(`Auto-marked shift ${shift.id} as missed`);
    }

    return missedShifts.length;
  } catch (error) {
    console.error("Error auto-marking missed shifts:", error);
    return 0;
  }
};

// Cancel a shift (Admin or Attendant)
export const cancelShift = async (req, res) => {
  try {
    const { shiftId } = req.params;
    const shift = await Shift.findByPk(shiftId, {
      include: [{ model: User, as: "attendant", attributes: ["id", "name", "email"] }]
    });

    if (!shift) return res.status(404).json({ message: "Shift not found" });

    // Check permissions: Admin can cancel any shift, attendant only their own
    if (req.user.role !== "admin" && shift.attendantId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to cancel this shift" });
    }

    // Attendants can only cancel SCHEDULED shifts, admins can cancel SCHEDULED or IN_PROGRESS
    if (req.user.role !== "admin" && shift.status !== "SCHEDULED") {
      return res.status(400).json({ message: "You can only cancel scheduled shifts" });
    }

    if (req.user.role === "admin" && !["SCHEDULED", "IN_PROGRESS"].includes(shift.status)) {
      return res.status(400).json({ message: "Cannot cancel completed, missed, or already cancelled shifts" });
    }

    shift.status = "CANCELLED";
    await shift.save();

    res.json({ message: "Shift cancelled successfully", shift });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error cancelling shift" });
  }
};

// Creative: Get shift analytics
export const getShiftAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const where = {};
    if (startDate && endDate) {
      where.scheduledDate = { [Op.between]: [startDate, endDate] };
    }

    const shifts = await Shift.findAll({ where });

    const analytics = {
      totalShifts: shifts.length,
      completedShifts: shifts.filter(s => s.status === "COMPLETED").length,
      missedShifts: shifts.filter(s => s.status === "MISSED").length,
      inProgressShifts: shifts.filter(s => s.status === "IN_PROGRESS").length,
      cancelledShifts: shifts.filter(s => s.status === "CANCELLED").length,
      overtimeShifts: shifts.filter(s => s.overtime).length,
      averageDuration: shifts.filter(s => s.duration).reduce((sum, s) => sum + s.duration, 0) / shifts.filter(s => s.duration).length || 0,
      shiftTypeBreakdown: {
        MORNING: shifts.filter(s => s.shiftType === "MORNING").length,
        AFTERNOON: shifts.filter(s => s.shiftType === "AFTERNOON").length,
        NIGHT: shifts.filter(s => s.shiftType === "NIGHT").length,
      }
    };

    res.json(analytics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching analytics" });
  }
};
