const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    appointmentDate: {
      type: String, // YYYY-MM-DD
      required: [true, 'Appointment date is required (YYYY-MM-DD)'],
      index: true,
    },
    timeSlot: {
      type: String, // e.g. "09:20 AM"
      required: [true, 'Time slot is required'],
    },
    tokenNumber: {
      type: Number,
      required: true,
    },
    bookingChannel: {
      type: String,
      enum: ['WALK_IN', 'PHONE_CALL'],
      default: 'WALK_IN',
    },
    status: {
      type: String,
      enum: ['WAITING', 'IN_CONSULTATION', 'COMPLETED', 'CANCELLED'],
      default: 'WAITING',
      index: true,
    },
    reasonForVisit: {
      type: String,
      default: 'General Consultation',
    },
    doctorNotes: {
      type: String,
      default: '',
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID'],
      default: 'PENDING',
    },
  },
  { timestamps: true }
);

// Compound index to prevent double bookings on the exact same date & slot for a doctor
appointmentSchema.index(
  { doctor: 1, appointmentDate: 1, timeSlot: 1 },
  { unique: true, partialFilterExpression: { status: { $ne: 'CANCELLED' } } }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
