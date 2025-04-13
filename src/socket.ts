import { io } from 'socket.io-client';

// Create socket instance using relative path to leverage Vite proxy
export const socket = io('/', {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Add socket event listeners for debugging
socket.on('connect', () => {
  console.log('Socket connected');
});

socket.on('disconnect', () => {
  console.log('Socket disconnected');
});

socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error);
});

socket.on('error', (error) => {
  console.error('Socket error:', error);
});
