import { bs } from '@/logic/_state';

export function drawTile(playerId: number) {
  const player = bs.players[playerId];
  const tile = player.deck.shift();
  if (tile) {
    player.hand.push(tile);
  }
}
