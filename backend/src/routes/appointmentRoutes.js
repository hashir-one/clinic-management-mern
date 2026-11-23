const express = require('express');
const router = express.Router();
const {
  getAppointments,
  getTodayQueue,
  createAppointment,
  updateAppointmentStatus,
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

// All appointment management requires staff login
router.use(protect);

router.route('/')
  .get(getAppointments)
  .post(createAppointment);

router.get('/today/queue', getTodayQueue);
router.patch('/:id/status', updateAppointmentStatus);

module.exports = router;
