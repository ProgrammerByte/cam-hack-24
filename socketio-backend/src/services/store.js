export const state = {
  players: [],
  gameInProgress: false,
  gameStartTime: null,
  controlPoints: [],
  respawnPoints: [],
};

export const internal = {
  gameLoopUnsub: null,
};
