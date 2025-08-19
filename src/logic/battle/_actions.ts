/* 
These are actions serve as an interface between the UI and the logic.

They are used to trigger logic functions and update the state.
*/

import type { Position, Tile } from '@/logic/_model';
import { playTile } from '@/logic/battle/tile';

export function dropTile(tile: Tile, position: Position) {
  // TODO: check if valid, else return error to the UI
  playTile(tile, position);
}
