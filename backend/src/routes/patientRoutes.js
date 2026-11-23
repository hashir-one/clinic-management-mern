const express = require('express');
const router = express.Router();
const {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
} = require('../controllers/patientController');
const { protect } = require('../middleware/authMiddleware');

// All patient endpoints require authenticated staff access
router.use(protect);

router.route('/')
  .get(getPatients)
  .post(createPatient);

router.route('/:id')
  .get(getPatientById)
  .put(updatePatient);

module.exports = router;
