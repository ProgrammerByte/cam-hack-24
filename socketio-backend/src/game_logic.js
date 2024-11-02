import { state } from "./services/store";

export function startGame() {
  for (const player of state.players) {
    if (!player.team) continue;
    player.health = 100;
  }
}
