const Patient = require('../models/Patient');

// @desc    Get/Search patients by phone or name
// @route   GET /api/patients
// @access  Private/Staff
const getPatients = async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search && search.trim() !== '') {
      const term = search.trim();
      query = {
        $or: [
          { phone: { $regex: term, $options: 'i' } },
          { fullName: { $regex: term, $options: 'i' } },
        ],
      };
    }

    const patients = await Patient.find(query)
      .sort({ updatedAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: patients.length,
      patients,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get patient by ID with visit history
// @route   GET /api/patients/:id
// @access  Private/Staff
const getPatientById = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    res.status(200).json({ success: true, patient });
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new patient
// @route   POST /api/patients
// @access  Private/Staff
const createPatient = async (req, res, next) => {
  try {
    const { fullName, phone, age, gender, bloodGroup, address } = req.body;

    // Check if patient with this exact phone already exists
    const existingPatient = await Patient.findOne({ phone: phone.trim() });
    if (existingPatient) {
      return res.status(400).json({
        success: false,
        message: 'A patient with this phone number already exists.',
        patient: existingPatient,
      });
    }

    const patient = await Patient.create({
      fullName,
      phone: phone.trim(),
      age,
      gender,
      bloodGroup: bloodGroup || 'Unknown',
      address: address || '',
    });

    res.status(201).json({
      success: true,
      message: 'Patient registered successfully',
      patient,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update patient information
// @route   PUT /api/patients/:id
// @access  Private/Staff
const updatePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    res.status(200).json({ success: true, patient });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
};
