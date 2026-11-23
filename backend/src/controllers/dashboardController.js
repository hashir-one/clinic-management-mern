const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

// @desc    Get dashboard metrics & summary
// @route   GET /api/dashboard/stats
// @access  Private/Staff
const getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const [
      totalPatients,
      activeDoctors,
      todayAppointments,
      waitingQueueCount,
      completedTodayCount,
    ] = await Promise.all([
      Patient.countDocuments(),
      Doctor.countDocuments({ isActive: true }),
      Appointment.countDocuments({ appointmentDate: today, status: { $ne: 'CANCELLED' } }),
      Appointment.countDocuments({ appointmentDate: today, status: 'WAITING' }),
      Appointment.countDocuments({ appointmentDate: today, status: 'COMPLETED' }),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalPatients,
        activeDoctors,
        todayAppointments,
        waitingQueueCount,
        completedTodayCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
};
