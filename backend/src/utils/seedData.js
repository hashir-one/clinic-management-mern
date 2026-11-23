const User = require('../models/User');
const Doctor = require('../models/Doctor');

const seedData = async () => {
  try {
    // 1. Seed Admin
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const email = process.env.INITIAL_ADMIN_EMAIL || 'admin@clinic.local';
      const password = process.env.INITIAL_ADMIN_PASSWORD || 'Admin123!';
      const name = process.env.INITIAL_ADMIN_NAME || 'Clinic Administrator';

      await User.create({
        name,
        email,
        password,
        role: 'admin',
        isActive: true,
      });

      console.log(`[Seed] Initial Admin account created: ${email} (Password: ${password})`);
    }

    // 2. Seed Sample Doctors if none exist
    const doctorCount = await Doctor.countDocuments();
    if (doctorCount === 0) {
      const sampleDoctors = [
        {
          fullName: 'Dr. Gregory House',
          email: 'dr.house@clinic.local',
          phone: '+1 555-0101',
          specialization: 'Internal Medicine & Diagnostics',
          department: 'General Medicine',
          qualification: 'MD, FACP',
          experienceYears: 15,
          consultationFee: 350,
          workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          shifts: {
            morning: { start: '09:00', end: '13:00', enabled: true },
            evening: { start: '16:00', end: '19:00', enabled: true },
          },
          slotDurationMinutes: 20,
          bio: 'Specialist in complex diagnostic pathology and adult internal medicine with 15 years clinical experience.',
          isActive: true,
        },
        {
          fullName: 'Dr. Allison Cameron',
          email: 'dr.cameron@clinic.local',
          phone: '+1 555-0102',
          specialization: 'Pediatric Care & Immunology',
          department: 'Pediatrics',
          qualification: 'MD, FAAP',
          experienceYears: 9,
          consultationFee: 280,
          workingDays: ['Monday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          shifts: {
            morning: { start: '08:30', end: '12:30', enabled: true },
            evening: { start: '15:00', end: '18:00', enabled: true },
          },
          slotDurationMinutes: 20,
          bio: 'Dedicated pediatrician focused on neonatal care, routine child immunizations, and preventive pediatric health.',
          isActive: true,
        },
        {
          fullName: 'Dr. Robert Chase',
          email: 'dr.chase@clinic.local',
          phone: '+1 555-0103',
          specialization: 'Cardiovascular Care',
          department: 'Cardiology',
          qualification: 'MD, FACC',
          experienceYears: 11,
          consultationFee: 400,
          workingDays: ['Tuesday', 'Wednesday', 'Friday', 'Saturday'],
          shifts: {
            morning: { start: '10:00', end: '14:00', enabled: true },
            evening: { start: '17:00', end: '20:00', enabled: true },
          },
          slotDurationMinutes: 30,
          bio: 'Board-certified cardiologist offering outpatient ECG analysis, hypertension management, and heart screenings.',
          isActive: true,
        },
      ];

      await Doctor.insertMany(sampleDoctors);
      console.log(`[Seed] Seeded ${sampleDoctors.length} sample doctors for clinical demonstration.`);
    }
  } catch (error) {
    console.error(`[Seed Error] Failed to seed initial data: ${error.message}`);
  }
};

module.exports = seedData;
