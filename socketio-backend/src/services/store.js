export const state = {
  players: [],
  gameInProgress: false,
  gameStartTime: null,
  controlPoints: [],
  respawnPoints: [],
  scores: {
    ["Scientists"]: 0,
    ["Marine Corps"]: 0,
  },
};

export const internal = {
  gameLoopInterval: null,
};
