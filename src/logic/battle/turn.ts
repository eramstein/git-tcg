import type { BattleState } from '../_model';
import { drawTile } from './player';

export function nextTurn(bs: BattleState) {
  console.log('next turn', bs.turn, bs.activePlayerId);
  const totalTilesLeft = bs.players.reduce(
    (acc, player) => acc + player.hand.length + player.deck.length,
    0
  );
  if (totalTilesLeft === 0) {
    const playerWithHighestScore = bs.players.reduce((acc, player) =>
      player.score > acc.score ? player : acc
    );
    bs.victoriousPlayerId = playerWithHighestScore.id;
    return;
  }
  endPlayerTurn(bs, bs.activePlayerId);
  bs.turn++;
  bs.activePlayerId = bs.activePlayerId === bs.players[0].id ? bs.players[1].id : bs.players[0].id;
  initPlayerTurn(bs, bs.activePlayerId);
}

function initPlayerTurn(bs: BattleState, playerId: number) {}

function endPlayerTurn(bs: BattleState, playerId: number) {
  drawTile(bs, playerId);
}
