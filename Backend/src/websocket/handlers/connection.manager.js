// websocket/managers/connection.manager.js

const connections = new Map();
const userSockets = new Map();

export function addUserSocket(userId, socket) {
  userSockets.set(userId.toString(), socket);
}

export function getUserSocket(userId) {
  return userSockets.get(userId.toString());
}

export function removeUserSocket(userId) {
  userSockets.delete(userId.toString());
}

export function addConnection(socketId, data) {
  connections.set(socketId, data);
}

export function getConnection(socketId) {
  return connections.get(socketId);
}

export function removeConnection(socketId) {
  connections.delete(socketId);
}

export const sendToUser = (userId, message) => {
  const socket = userSockets.get(userId);
  if (socket) {
    socket.send(JSON.stringify(message));
  }
}