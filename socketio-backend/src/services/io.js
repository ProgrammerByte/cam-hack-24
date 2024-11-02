import { Server } from "socket.io";
import { state } from "./store";

export const io = new Server({
  allowEIO3: true,
  cors: {
    origin: config.origin,
  },
  pingTimeout: 5000,
  pingInterval: 5000,
});

export function broadcastState() {
  io.emit("state", state);
}
