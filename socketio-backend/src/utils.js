import { state } from "./services/store.js";

export function findMostLikelyShot(shooter) {
  const enemies = state.players.filter(
    (player) =>
      player.team &&
      player.team !== shooter.team &&
      player.positionLastUpdated > Date.now() - 1000
  );

  const { position: shooterPos, heading: shooterHeading } = shooter;

  // Function to calculate the angle between two vectors
  function calculateAngle(vec1, vec2) {
    const dotProduct = vec1.x * vec2.x + vec1.y * vec2.y;
    const magnitude1 = Math.sqrt(vec1.x ** 2 + vec1.y ** 2);
    const magnitude2 = Math.sqrt(vec2.x ** 2 + vec2.y ** 2);
    return Math.acos(dotProduct / (magnitude1 * magnitude2));
  }

  // Function to get a vector from shooter to another player
  function getVector(from, to) {
    return { x: to.x - from.x, y: to.y - from.y };
  }

  let mostLikelyShot = null;
  let smallestAngle = Math.PI / 9; // 20 degrees

  // Loop through each player to find the narrowest angle
  for (const player of enemies) {
    if (player.playerName === shooterName) continue; // Skip the shooter

    const playerPos = player.position;
    const vectorToPlayer = getVector(shooterPos, playerPos);

    // Calculate the angle between the shooter's heading and the vector to this player
    const angle = calculateAngle(shooterHeading, vectorToPlayer);

    // Update if this angle is the smallest so far
    if (angle < smallestAngle) {
      smallestAngle = angle;
      mostLikelyShot = player;
    }
  }

  return mostLikelyShot;
}
