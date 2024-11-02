import {} from "../controllers/socket_controllers";
import { broadcastState, io } from "../services/io";
import { connectionMiddleware } from "./socket_middleware";
import { players, state } from "../services/store";

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

    socket.on("startGame", async (gameName) => {
      // TODO
    });

    socket.on("endGame", async () => {
      // TODO
    });

    socket.on("kickPlayer", async (playerName) => {
      const player = popPlayer(playerName);

      const playerSocket = io.sockets.sockets.get(player.socketId);
      playerSocket?.disconnect();
    });

    socket.on("assignTeam", async (playerName, team) => {
      const player = players.find((player) => player.playerName === playerName);
      player.team = team;
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
        const player = players.find((player) => player.socketId === socket.id);

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
