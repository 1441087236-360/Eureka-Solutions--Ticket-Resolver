import mongoose from 'mongoose';

export const connectDatabase = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    throw new Error(
      'MONGO_URI is missing from the backend environment.'
    );
  }

  try {
    mongoose.set('strictQuery', true);
    mongoose.set('bufferCommands', false);

    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
      autoIndex: process.env.NODE_ENV !== 'production'
    });

    console.log('======================================');
    console.log('  DATABASE CONNECTION ESTABLISHED');
    console.log('======================================');
    console.log(`  Database: ${mongoose.connection.name}`);
    console.log(`  Host:     ${mongoose.connection.host}`);
    console.log(`  Status:   Connected`);
    console.log('======================================');

    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    throw error;
  }
};

export const disconnectDatabase = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log('MongoDB connection closed.');
  }
};

mongoose.connection.on('disconnected', () => {
  console.error('MongoDB connection lost.');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected successfully.');
});

mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error.message);
});
