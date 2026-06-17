import http from 'http';
import { initializeSocket } from './config/socket';
import app from './app';
import { env } from './config/env';
import { prisma } from './config/database';
import { setupCronJobs } from './cron/jobs';

const server = http.createServer(app);

// Initialize Socket.io
initializeSocket(server);

const startServer = async () => {
  try {
    // Check DB connection
    await prisma.$connect();
    console.log('✅ Connected to database');

    // Initialize Cron Jobs
    setupCronJobs();
    console.log('✅ Cron jobs initialized');

    server.listen(env.PORT, () => {
      console.log(`✅ Server is running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
