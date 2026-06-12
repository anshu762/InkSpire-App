import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import { env } from './config/env';
import { prisma } from './config/database';

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: env.CLIENT_URL,
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

const startServer = async () => {
  try {
    // Check DB connection
    await prisma.$connect();
    console.log('✅ Connected to database');

    server.listen(env.PORT, () => {
      console.log(`✅ Server is running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
