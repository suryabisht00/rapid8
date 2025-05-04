import { io } from "socket.io-client";

const socket = io("https://rapid8-backend.onrender.com", {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  transports: ["polling", "websocket"],
  autoConnect: false,
  path: "/socket.io/",
});

export default socket;
