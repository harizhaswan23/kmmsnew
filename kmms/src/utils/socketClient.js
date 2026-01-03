// frontend/src/utils/socketClient.js
import { io } from "socket.io-client";

let socket = null;

export function initSocket() {
  if (socket) return socket;
  const token = localStorage.getItem('token'); // or wherever you store JWT
  socket = io(process.env.REACT_APP_API_URL || '/', {
    // pass token in handshake auth
    auth: {
      token: token ? `Bearer ${token}` : ''
    },
    transports: ['websocket']
  });

  socket.on('connect', () => {
    console.log('Socket connected', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected', reason);
  });

  return socket;
}

export function getSocket() {
  if (!socket) return initSocket();
  return socket;
}
