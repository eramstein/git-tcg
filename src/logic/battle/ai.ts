import { bs } from '../_state';
import { nextTurn } from './turn';
import { getPossiblePositions } from './board';
import { playTile } from './tile';

export function playAiTurn() {
  console.log('playAiTurn', bs.turn, bs.activePlayerId);

  // Get the current AI player
  const aiPlayer = bs.players[bs.activePlayerId];

  // Check if AI player has tiles in hand
  if (!aiPlayer || aiPlayer.hand.length === 0) {
    console.log('AI player has no tiles to play');
    nextTurn();
    return;
  }

  // Get all possible positions where a tile can be placed
  const possiblePositions = getPossiblePositions();

  if (possiblePositions.length === 0) {
    console.log('No valid positions to place tile');
    nextTurn();
    return;
  }

  // Randomly select a tile from AI player's hand
  const randomTileIndex = Math.floor(Math.random() * aiPlayer.hand.length);
  const selectedTile = aiPlayer.hand[randomTileIndex];

  // Randomly select a position from possible positions
  const randomPositionIndex = Math.floor(Math.random() * possiblePositions.length);
  const selectedPosition = possiblePositions[randomPositionIndex];

  console.log('AI playing tile:', selectedTile, 'at position:', selectedPosition);

  // Play the tile at the selected position
  playTile(selectedTile, selectedPosition);
}
