/* 
These are actions serve as an interface between the UI and the logic.

They are used to trigger logic functions and update the state.
*/

import type { Position, Tile } from '@/logic/_model';
import { playTile } from '@/logic/battle/tile';
import { bs } from '../_state';

export function dropTile(playerId: number, tile: Tile, position: Position) {
  if (playerId !== bs.activePlayerId) {
    console.error('Invalid player id', playerId, bs.activePlayerId);
    return;
  }
  // TODO: check if valid, else return error to the UI
  playTile(tile, position);
}
