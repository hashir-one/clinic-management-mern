const mongoose = require('mongoose');

let mongodInstance = null;

const connectDB = async () => {
  const isDev = process.env.NODE_ENV !== 'production';
  const primaryUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/clinic_db';

  try {
    // Attempt standard connection with 2.5s server selection timeout
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`[Database] MongoDB Connected to host: ${conn.connection.host}`);
    return;
  } catch (initialErr) {
    if (!isDev) {
      console.error(`[Database Error] Production connection failed: ${initialErr.message}`);
      process.exit(1);
    }

    console.warn(`[Database] Standard MongoDB connection at ${primaryUri} unavailable (${initialErr.message}).`);
    console.log('[Database] Initiating embedded MongoDB engine for zero-dependency local testing...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create();
      const inMemoryUri = mongodInstance.getUri();

      const conn = await mongoose.connect(inMemoryUri);
      console.log(`[Database] Connected to embedded MongoDB engine successfully!`);
      console.log(`[Database] Local test database is active and ready.`);
    } catch (fallbackErr) {
      console.error(`[Database Error] Could not start embedded MongoDB fallback: ${fallbackErr.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
