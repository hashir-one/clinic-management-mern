const express = require('express');
const router = express.Router();
const {
  getDoctors,
  getDoctorById,
  getDoctorAvailableSlots,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public route to view doctors
router.get('/', getDoctors);
router.get('/:id', getDoctorById);

// Staff route to check real-time slots
router.get('/:id/slots', protect, getDoctorAvailableSlots);

// Admin-only doctor management
router.post('/', protect, authorize('admin'), createDoctor);
router.put('/:id', protect, authorize('admin'), updateDoctor);
router.delete('/:id', protect, authorize('admin'), deleteDoctor);

module.exports = router;
