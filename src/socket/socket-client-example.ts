/**
 * SOCKET.IO CLIENT EXAMPLE (Frontend)
 *
 * Install: npm install socket.io-client
 */

/*
import { io } from 'socket.io-client';

// Get token from cookies or localStorage after login
const getAccessToken = () => {
  return document.cookie.split('; ')
    .find(row => row.startsWith('accessToken='))
    ?.split('=')[1];
};

// Connect to Socket.IO server
const socket = io('http://localhost:5000', {
  auth: {
    token: getAccessToken() // Send token for authentication
  }
});

// Connection events
socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('error', (error) => {
  console.error('Socket error:', error);
});

// PUBLIC EVENT (no authentication required)
socket.emit('public:message', { text: 'Hello World' });

socket.on('public:message:response', (data) => {
  console.log('Public response:', data);
});

// GUEST EVENT (guest or authenticated users)
socket.emit('guest:ping', { message: 'Ping' });

socket.on('guest:pong', (data) => {
  console.log('Guest pong:', data);
});

// PRIVATE EVENT (only authenticated users)
socket.emit('private:message', { text: 'Secret message' });

socket.on('private:message:response', (data) => {
  console.log('Private response:', data);
});

// ADMIN EVENT (only admin users)
socket.emit('admin:broadcast', { message: 'Important announcement' });

socket.on('admin:announcement', (data) => {
  console.log('Admin announcement:', data);
});

// JOIN ROOM
socket.emit('join:room', 'chat-room-1');

socket.on('room:joined', (data) => {
  console.log('Joined room:', data);
});
*/
