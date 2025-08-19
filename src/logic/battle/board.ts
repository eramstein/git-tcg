import type { Position, TileDeployed } from '../_model';
import { bs } from '../_state';

// Get all possible positions where a tile can be dropped
export function getPossiblePositions(): Position[] {
  if (bs.tiles.length === 0) {
    // First tile can only be placed at center
    return [{ x: 0, y: 0 }];
  }

  // Get all adjacent positions to existing tiles
  const adjacentPositions = new Set<Position>();

  for (const tile of bs.tiles) {
    const { x, y } = tile.position;
    // Check all 4 adjacent positions
    const adjacent = [
      { x: x + 1, y },
      { x: x - 1, y },
      { x, y: y + 1 },
      { x, y: y - 1 },
    ];

    for (const pos of adjacent) {
      // Check if position is not already occupied
      const isOccupied = bs.tiles.some(
        (t: TileDeployed) => t.position.x === pos.x && t.position.y === pos.y
      );
      if (!isOccupied) {
        adjacentPositions.add(pos);
      }
    }
  }

  return Array.from(adjacentPositions);
}
