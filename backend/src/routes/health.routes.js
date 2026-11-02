import { Router } from 'express';
import mongoose from 'mongoose';

const router = Router();

router.get('/', (req, res) => {
  const databaseConnected =
    mongoose.connection.readyState === 1;

  return res.status(databaseConnected ? 200 : 503).json({
    success: databaseConnected,

    message: databaseConnected
      ? 'Support Ticket Tracker API is running.'
      : 'Database connection is unavailable.',

    data: {
      service: 'support-ticket-tracker-api',

      environment:
        process.env.NODE_ENV || 'development',

      database: databaseConnected
        ? 'connected'
        : 'disconnected',

      timestamp: new Date().toISOString()
    }
  });
});

export default router;