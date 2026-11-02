import 'dotenv/config';
import app from './app.js';
import {
  connectDatabase,
  disconnectDatabase
} from './config/database.js';
import { validateEnvironment } from './config/env.js';

const PORT = Number(process.env.PORT) || 5000;

let server;
let isShuttingDown = false;

const startServer = async () => {
  try {
    validateEnvironment();

    await connectDatabase();

    server = await new Promise((resolve, reject) => {
      const instance = app.listen(
        PORT,
        '0.0.0.0',
        () => {
          resolve(instance);
        }
      );

      instance.once('error', reject);
    });

    console.log('');
    console.log('======================================');
    console.log('  SUPPORT TICKET TRACKER API');
    console.log('======================================');
    console.log(`  Environment: ${process.env.NODE_ENV}`);
    console.log(`  Port:        ${PORT}`);
    console.log(`  API:         http://localhost:${PORT}/api`);
    console.log(`  Health:      http://localhost:${PORT}/api/health`);
    console.log('  Database:    Connected');
    console.log('======================================');
    console.log('');

  } catch (error) {
    console.error('Application startup failed:', error.message);

    await disconnectDatabase().catch(() => {});

    process.exitCode = 1;
  }
};

const shutdown = async (signal) => {
  if (isShuttingDown) return;

  isShuttingDown = true;

  console.log(`\n${signal} received. Shutting down...`);

  try {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    }

    await disconnectDatabase();

    console.log('Application shutdown complete.');
    process.exitCode = 0;

  } catch (error) {
    console.error('Shutdown error:', error);
    process.exitCode = 1;
  }
};

process.once('SIGINT', () => shutdown('SIGINT'));
process.once('SIGTERM', () => shutdown('SIGTERM'));
startServer();