import { io } from "socket.io-client";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "https://smart-resort-360-r3gq.onrender.com");

// Named export 'socket'
export const socket = io(API_BASE_URL, {
  autoConnect: true,
  transports: ["websocket", "polling"],
});

// Default export
export default socket;