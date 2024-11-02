import { broadcastState, io } from "../services/io.js";
import { connectionMiddleware } from "./socket_middleware.js";
import { internal, state } from "../services/store.js";
import { findMostLikelyShot } from "../utils.js";

function popPlayer(playerName) {
  const player = state.players.find(
    (player) => player.playerName === playerName
  );
  state.players = state.players.filter(
    (player) => player.playerName !== playerName
  );
  return player;
}

export function initSocketServer() {
  io.use(connectionMiddleware);

  io.on("connection", async (socket) => {
    broadcastState();

    socket.on("startGame", async () => {
      if (!socket.data.isAdmin) return;

      for (const player of state.players) {
        if (!player.team) continue;
        player.health = 100;
      }
      state.gameInProgress = true;
      state.gameStartTime = Date.now();

      internal.gameLoopUnsub = setInterval(() => {
        // Game loop
        // TODO: Implement game loop
      }, 50);

      console.info("Game started.");
    });

    socket.on("endGame", async () => {
      if (!socket.data.isAdmin) return;

      state.gameInProgress = false;
      state.gameStartTime = null;
      console.info("Game ended.");
    });

    socket.on("addControlPoint", async (position) => {
      if (!socket.data.isAdmin) return;

      state.controlPoints.push(position);
    });

    socket.on("removeControlPoint", async (index) => {
      if (!socket.data.isAdmin) return;

      state.controlPoints.splice(index, 1);
    });

    socket.on("addRespawnPoint", async (position, team) => {
      if (!socket.data.isAdmin) return;

      state.respawnPoints.push({ position, team });
    });

    socket.on("removeRespawnPoint", async (index) => {
      if (!socket.data.isAdmin) return;

      state.respawnPoints.splice(index, 1);
    });

    socket.on("kickPlayer", async (playerName) => {
      if (!socket.data.isAdmin) return;
      const player = popPlayer(playerName);

      const playerSocket = io.sockets.sockets.get(player.socketId);
      playerSocket?.disconnect();
    });

    socket.on("assignTeam", async (playerName, team) => {
      if (!socket.data.isAdmin) return;
      const player = state.players.find(
        (player) => player.playerName === playerName
      );
      player.team = team;
    });

    socket.on("shoot", async () => {
      const shooter = state.players.find(
        (player) => player.socketId === socket.id
      );

      if (!shooter || shooter.health <= 0) return;

      const target = findMostLikelyShot(shooter);
      if (target) {
        target.health = Math.max(0, target.health - 10);
      }
    });

    socket.on("setPosAndHeading", async (playerName, position, heading) => {
      const player = state.players.find(
        (player) => player.playerName === playerName
      );
      player.position = position;
      player.heading = heading;
      player.positionLastUpdated = Date.now();
    });

    socket.on("disconnect", async (reason) => {
      // No need to handle kicked player
      if (reason === "server namespace disconnect") {
        console.info(`Kicked ${socket.data.playerName}.`);
        return;
      }
      const playerName = socket.data.playerName;

      // If client intentionally disconnected, remove from room
      // Otherwise, mark as lost connection so they can rejoin
      if (reason === "client namespace disconnect") {
        popPlayer(playerName);

        console.info(`${playerName} left.`);
      } else {
        const player = state.players.find(
          (player) => player.socketId === socket.id
        );

        // If no player is found, player must have already reconnected
        if (!player) {
          console.info("Player already reconnected, ignoring disconnect.");
        } else {
          player.connected = false;
          console.info(`${playerName} lost connection.`);
        }
      }
    });
  });
}
