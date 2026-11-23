const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Doctor name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Doctor email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Doctor phone number is required'],
      trim: true,
    },
    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },
    qualification: {
      type: String,
      default: 'MBBS, MD',
    },
    experienceYears: {
      type: Number,
      default: 5,
    },
    consultationFee: {
      type: Number,
      required: [true, 'Consultation fee is required'],
      default: 300,
    },
    workingDays: {
      type: [String],
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    },
    shifts: {
      morning: {
        start: { type: String, default: '09:00' },
        end: { type: String, default: '13:00' },
        enabled: { type: Boolean, default: true },
      },
      evening: {
        start: { type: String, default: '17:00' },
        end: { type: String, default: '20:00' },
        enabled: { type: Boolean, default: true },
      },
    },
    slotDurationMinutes: {
      type: Number,
      default: 20,
    },
    bio: {
      type: String,
      default: 'Dedicated healthcare professional serving patients with quality care.',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Doctor', doctorSchema);
