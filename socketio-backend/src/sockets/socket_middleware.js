import { state } from "../services/store.js";
import { generateFunnyName } from "../utils.js";

async function connectionMiddlewareRaw(socket, next) {
  const auth = socket.handshake.auth;
  if (auth.token == "beans") {
    socket.data = {
      isAdmin: true,
    };
  } else {
    let player;

    if (auth.sessionId) {
      // Player reconnecting
      player = state.players.find(
        (player) => player.sessionId === auth.sessionId
      );
    }

    if (player) {
      player.connected = true;
      player.socketId = socket.id;
    } else {
      const sid = auth.sessionId || Math.random().toString(36).substring(2, 15);
      player = {
        playerName: generateFunnyName(),
        sessionId: sid,
        connected: true,
        team: null,
        socketId: socket.id,
      };
      state.players.push(player);
      console.log("Player joined room", player);
    }

    // Set socket data
    socket.data = {
      playerName: player.playerName,
      sessionId: player.sessionId,
      serverTime: Math.floor(Date.now()),
    };
  }

  // Sends relevant connection details to client
  socket.emit("sessionData", socket.data);

  next();
}

export async function connectionMiddleware(socket, next) {
  connectionMiddlewareRaw(socket, next).catch((err) => {
    console.error("Connection middleware error", err);
    next(err);
  });
}
