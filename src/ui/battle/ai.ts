import { bs } from '@/ui/ui-state.svelte';
import { getPossiblePositions } from '@/logic/battle/board';
import type { Position, Tile } from '@/logic/_model';

export function playAiTurn(): { tile: Tile; position: Position } | null {
  console.log('playAiTurn', bs.turn, bs.activePlayerId);

  // Get the current AI player
  const aiPlayer = bs.players[bs.activePlayerId];

  // Check if AI player has tiles in hand
  if (!aiPlayer || aiPlayer.hand.length === 0) {
    console.log('AI player has no tiles to play');
    return null;
  }

  // Get all possible positions where a tile can be placed
  const possiblePositions = getPossiblePositions(bs);

  // Randomly select a tile from AI player's hand
  const randomTileIndex = Math.floor(Math.random() * aiPlayer.hand.length);
  const selectedTile = aiPlayer.hand[randomTileIndex];

  // Randomly select a position from possible positions
  const randomPositionIndex = Math.floor(Math.random() * possiblePositions.length);
  const selectedPosition = possiblePositions[randomPositionIndex];

  console.log('AI playing tile:', selectedTile, 'at position:', selectedPosition);

  // Play the tile at the selected position
  return { tile: selectedTile, position: selectedPosition };
}
