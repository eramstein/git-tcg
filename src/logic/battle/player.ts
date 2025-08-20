import type { BattleState } from '../_model';

export function drawTile(bs: BattleState, playerId: number) {
  const player = bs.players[playerId];
  const tile = player.deck.shift();
  if (tile) {
    player.hand.push(tile);
  }
}
