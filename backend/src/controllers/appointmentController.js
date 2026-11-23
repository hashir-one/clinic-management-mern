const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

// Helper to calculate daily next token number for a doctor on a specific date
const getNextTokenNumber = async (doctorId, date) => {
  const highestAppointment = await Appointment.findOne({
    doctor: doctorId,
    appointmentDate: date,
  })
    .sort({ tokenNumber: -1 })
    .select('tokenNumber');

  return highestAppointment ? highestAppointment.tokenNumber + 1 : 1;
};

// @desc    Get appointments with filters (date, doctorId, status)
// @route   GET /api/appointments
// @access  Private/Staff
const getAppointments = async (req, res, next) => {
  try {
    const { date, doctorId, status } = req.query;
    const query = {};

    if (date) query.appointmentDate = date;
    if (doctorId) query.doctor = doctorId;
    if (status) query.status = status;

    const appointments = await Appointment.find(query)
      .populate('patient', 'fullName phone age gender bloodGroup')
      .populate('doctor', 'fullName specialization consultationFee')
      .populate('bookedBy', 'name role')
      .sort({ appointmentDate: -1, tokenNumber: 1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get live daily queue board (today's appointments sorted by token)
// @route   GET /api/appointments/today/queue
// @access  Private/Staff
const getTodayQueue = async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const { doctorId } = req.query;

    const query = { appointmentDate: today };
    if (doctorId) query.doctor = doctorId;

    const appointments = await Appointment.find(query)
      .populate('patient', 'fullName phone age gender')
      .populate('doctor', 'fullName specialization')
      .sort({ tokenNumber: 1 });

    res.status(200).json({
      success: true,
      date: today,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create appointment (Receptionist / Staff only)
// @route   POST /api/appointments
// @access  Private/Staff
const createAppointment = async (req, res, next) => {
  try {
    const {
      patientId,
      doctorId,
      appointmentDate,
      timeSlot,
      bookingChannel,
      reasonForVisit,
      paymentStatus,
    } = req.body;

    if (!patientId || !doctorId || !appointmentDate || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Please provide patient, doctor, appointment date, and time slot',
      });
    }

    // Verify patient and doctor exist
    const [patient, doctor] = await Promise.all([
      Patient.findById(patientId),
      Doctor.findById(doctorId),
    ]);

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    if (!doctor || !doctor.isActive) {
      return res.status(404).json({ success: false, message: 'Doctor not found or inactive' });
    }

    // Check if slot is already taken
    const existingSlot = await Appointment.findOne({
      doctor: doctorId,
      appointmentDate,
      timeSlot,
      status: { $ne: 'CANCELLED' },
    });

    if (existingSlot) {
      return res.status(400).json({
        success: false,
        message: `This time slot (${timeSlot}) is already booked for Dr. ${doctor.fullName}. Please choose another slot.`,
      });
    }

    // Generate daily token
    const tokenNumber = await getNextTokenNumber(doctorId, appointmentDate);

    const appointment = await Appointment.create({
      patient: patientId,
      doctor: doctorId,
      bookedBy: req.user._id,
      appointmentDate,
      timeSlot,
      tokenNumber,
      bookingChannel: bookingChannel || 'WALK_IN',
      status: 'WAITING',
      reasonForVisit: reasonForVisit || 'General Consultation',
      paymentStatus: paymentStatus || 'PENDING',
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patient', 'fullName phone age gender')
      .populate('doctor', 'fullName specialization consultationFee')
      .populate('bookedBy', 'name');

    res.status(201).json({
      success: true,
      message: 'Appointment successfully booked',
      appointment: populatedAppointment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment status (WAITING -> IN_CONSULTATION -> COMPLETED / CANCELLED)
// @route   PATCH /api/appointments/:id/status
// @access  Private/Staff
const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status, doctorNotes, paymentStatus } = req.body;

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (status) appointment.status = status;
    if (doctorNotes !== undefined) appointment.doctorNotes = doctorNotes;
    if (paymentStatus) appointment.paymentStatus = paymentStatus;

    await appointment.save();

    const updated = await Appointment.findById(appointment._id)
      .populate('patient', 'fullName phone')
      .populate('doctor', 'fullName specialization');

    res.status(200).json({
      success: true,
      message: 'Appointment status updated',
      appointment: updated,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAppointments,
  getTodayQueue,
  createAppointment,
  updateAppointmentStatus,
};
