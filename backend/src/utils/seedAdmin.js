const User = require('../models/User');

const seedAdmin = async () => {
  try {
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

      console.log(`[Seed] Initial Admin user created: ${email}`);
    }
  } catch (error) {
    console.error(`[Seed Error] Failed to seed initial admin: ${error.message}`);
  }
};

module.exports = seedAdmin;
