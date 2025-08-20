import type { BattleState, Position, TileDeployed } from '../_model';

// Get all possible positions where a tile can be dropped
export function getPossiblePositions(bs: BattleState): Position[] {
  if (bs.tiles.length === 0) {
    // First tile can only be placed at center
    return [{ x: 0, y: 0 }];
  }

  // Get all adjacent positions to existing tiles
  const adjacentPositions = new Set<Position>();

  for (const tile of bs.tiles) {
    const { x, y } = tile.position;
    for (const pos of getAdjacentPositions({ x, y })) {
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

export function getAdjacentPositions(position: Position): Position[] {
  return [
    { x: position.x + 1, y: position.y },
    { x: position.x - 1, y: position.y },
    { x: position.x, y: position.y + 1 },
    { x: position.x, y: position.y - 1 },
  ];
}

export function getAdjacentTiles(bs: BattleState, position: Position): TileDeployed[] {
  return bs.tiles.filter(
    (tile) =>
      (tile.position.x === position.x + 1 && tile.position.y === position.y) ||
      (tile.position.x === position.x - 1 && tile.position.y === position.y) ||
      (tile.position.x === position.x && tile.position.y === position.y + 1) ||
      (tile.position.x === position.x && tile.position.y === position.y - 1)
  );
}
