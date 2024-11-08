import { broadcastState, io } from "../services/io.js";
import { connectionMiddleware } from "./socket_middleware.js";
import { internal, state } from "../services/store.js";
import { findMostLikelyShot, findNear } from "../utils.js";

function popPlayer(playerName) {
  const player = state.players.find(
    (player) => player.playerName === playerName
  );
  state.players = state.players.filter(
    (player) => player.playerName !== playerName
  );
  return player;
}

const placeholderFindMostLikelyShot = (shooter) => {
  const enemies = state.players.filter(
    (player) =>
      player.team &&
      player.team !== shooter.team
  );
  return enemies[Math.floor(Math.random()*enemies.length)];
}

export function initSocketServer() {
  // Blip loop
  setInterval(() => {
    // TODO: Do blip
    io.emit("blip");
  }, 500);

  io.use(connectionMiddleware);

  setInterval(() => {
    broadcastState();
  }, 500);

  io.on("connection", async (socket) => {
    socket.on("startGame", async () => {
      if (!socket.data.isAdmin || state.gameInProgress) return;

      for (const player of state.players) {
        if (!player.team) continue;
        player.health = 100;
      }

      state.gameInProgress = true;
      state.gameStartTime = Date.now();
      state.scores = {
        ["Scientists"]: 0,
        ["Marine Corps"]: 0,
      };

      const timeDelta = 0.05;

      internal.gameLoopInterval = setInterval(() => {
        // Game loop
        for (const player of state.players) {
          if (!player.team) continue;

          // Regenerate health
          const points = findNear(player, state.respawnPoints).filter(
            (p) => p.team === player.team
          );
          if (points.length > 0) {
            player.health = Math.min(100, player.health + 20 * timeDelta);
          }

          // Control point
          const controlPoints = findNear(player, state.controlPoints);
          if (controlPoints.length > 0) {
            state.scores[player.team] += timeDelta;
          }
        }
      }, timeDelta * 1000);

      console.info("Game started.");
    });

    socket.on("endGame", async () => {
      if (!socket.data.isAdmin) return;

      state.gameInProgress = false;
      state.gameStartTime = null;
      state.scores = {
        ["Scientists"]: 0,
        ["Marine Corps"]: 0,
      };
      console.info("Game ended.");
      io.emit("gameEnded");

      clearInterval(internal.gameLoopInterval);
    });

    socket.on("scientistPoint", async () => {
      state.scores["Scientists"] += 1;
    })

    socket.on("soldierPoint", async () => {
      state.scores["Marine Corps"] += 1;
    })

    socket.on("addControlPoint", async (position) => {
      if (!socket.data.isAdmin) return;

      state.controlPoints.push({ position });
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
      io.emit("playerKicked", playerName);
      setTimeout(() => playerSocket?.disconnect(), 1000);
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

      // const target = findMostLikelyShot(shooter);
      const target = placeholderFindMostLikelyShot(shooter);
      if (target) {
        socket.emit("hit", shooter.playerName);
        target.health = Math.max(0, target.health - 10);
        if (target.health <= 0) {
          socket.emit("kill", shooter.playerName, target.playerName);
        }
      }
    });

    socket.on("healPlayer", async (playerName) => {
      const player = state.players.find(
        (player) => player.playerName === playerName
      );

      if (!player || player.healing) {
        return;
      }

      player.healing = true;

      const targetHealth = 100; // Target health after healing
      const healingDuration = 5000; // Duration in ms over which to heal
      const increment = 5; // Amount to increment each step
      const intervalTime = healingDuration / (targetHealth / increment); 
    
      const healInterval = setInterval(() => {
        if (player.health >= targetHealth) {
          player.health = targetHealth;
          player.healing = false;
          clearInterval(healInterval);
        } else {
          player.health += increment;
        }
      }, intervalTime);
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
