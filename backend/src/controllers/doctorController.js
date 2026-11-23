const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const { getAvailableSlots } = require('../utils/slotGenerator');

// @desc    Get all active doctors (Public / Staff)
// @route   GET /api/doctors
// @access  Public
const getDoctors = async (req, res, next) => {
  try {
    const { department } = req.query;
    const query = { isActive: true };

    if (department) {
      query.department = new RegExp(department, 'i');
    }

    const doctors = await Doctor.find(query).sort({ fullName: 1 });
    res.status(200).json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single doctor
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    res.status(200).json({ success: true, doctor });
  } catch (error) {
    next(error);
  }
};

// @desc    Get doctor available slots for a given date
// @route   GET /api/doctors/:id/slots
// @access  Private/Staff
const getDoctorAvailableSlots = async (req, res, next) => {
  try {
    const { date } = req.query; // YYYY-MM-DD
    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date query param (YYYY-MM-DD) is required',
      });
    }

    const doctor = await Doctor.findById(req.params.id);
    if (!doctor || !doctor.isActive) {
      return res.status(404).json({ success: false, message: 'Doctor not found or inactive' });
    }

    // Check if doctor works on this day of the week
    const targetDate = new Date(date);
    const dayOfWeek = targetDate.toLocaleDateString('en-US', { weekday: 'long' });

    if (!doctor.workingDays.includes(dayOfWeek)) {
      return res.status(200).json({
        success: true,
        isWorkingDay: false,
        message: `Doctor does not consult on ${dayOfWeek}s.`,
        slots: [],
      });
    }

    // Find all non-cancelled appointments for this doctor on this date
    const bookedAppointments = await Appointment.find({
      doctor: doctor._id,
      appointmentDate: date,
      status: { $ne: 'CANCELLED' },
    }).select('timeSlot');

    const bookedSlotTimes = bookedAppointments.map((app) => app.timeSlot);
    const slots = getAvailableSlots(doctor, bookedSlotTimes);

    res.status(200).json({
      success: true,
      isWorkingDay: true,
      date,
      dayOfWeek,
      slots,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create doctor (Admin only)
// @route   POST /api/doctors
// @access  Private/Admin
const createDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Doctor created successfully',
      doctor,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update doctor (Admin only)
// @route   PUT /api/doctors/:id
// @access  Private/Admin
const updateDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    res.status(200).json({ success: true, doctor });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete / deactivate doctor (Admin only)
// @route   DELETE /api/doctors/:id
// @access  Private/Admin
const deleteDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    doctor.isActive = false;
    await doctor.save();
    res.status(200).json({ success: true, message: 'Doctor deactivated successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDoctors,
  getDoctorById,
  getDoctorAvailableSlots,
  createDoctor,
  updateDoctor,
  deleteDoctor,
};
