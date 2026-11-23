const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Patient full name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required for lookup and booking'],
      trim: true,
      index: true,
    },
    age: {
      type: Number,
      required: [true, 'Patient age is required'],
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: [true, 'Gender is required'],
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'],
      default: 'Unknown',
    },
    address: {
      type: String,
      default: '',
    },
    medicalNotes: [
      {
        note: String,
        recordedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Patient', patientSchema);
