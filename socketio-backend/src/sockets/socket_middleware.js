import { state } from "../services/store.js";

function generateFunnyName() {
  const adjectives = [
    "Silly",
    "Spooky",
    "Scary",
    "Wobbly",
    "Chunky",
    "Rusty",
    "Jumpy",
    "Sneaky",
    "Quirky",
    "Sassy",
    "Gloomy",
    "Clumsy",
    "Fluffy",
    "Snazzy",
    "Goofy",
  ];

  const nouns = [
    "Headcrab",
    "Crowbar",
    "Combine",
    "G-Man",
    "Scientist",
    "Vortigaunt",
    "Barnacle",
    "Zombie",
    "Portal",
    "Lambda",
    "Strider",
    "Ravenholm",
    "Alyx",
    "Antlion",
    "Gargantua",
  ];

  // Pick a random adjective and noun
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];

  return `${adjective}${noun}`;
}

export async function connectionMiddlewareRaw(socket, next) {
  const auth = SocketAuth.parse(socket.handshake.auth);

  let player;

  if (auth.sessionId) {
    // Player reconnecting
    player = state.players.find(
      (player) => player.seesionId === auth.sessionId
    );

    if (!player) {
      throw new Error("REJOIN_FAILED", "Failed to rejoin room");
    }

    player.connected = true;
    player.socketId = socket.id;

    sessionId = auth.sessionId;
  } else {
    // Player joining for the first time
    player = {
      playerName: generateFunnyName(),
      sessionId: Math.random().toString(36).substring(2, 15),
      team: null,
      position: null,
      heading: null,
      positionLastUpdated: Date.now(),
      connected: true,
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
