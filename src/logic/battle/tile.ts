import { bs } from '@/logic/_state';
import type { Position, Tile } from '../_model';
import { drawTile } from './player';

export function playTile(tile: Tile, position: Position) {
  const player = bs.players[tile.ownerId];
  if (player) {
    player.hand.splice(player.hand.indexOf(tile), 1);
    bs.tiles.push({ ...tile, position, id: crypto.randomUUID() });
  }
  drawTile(0);
}
