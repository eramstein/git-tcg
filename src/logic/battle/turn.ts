import type { Player } from '../_model';
import { bs, LOCAL_PLAYER_ID } from '../_state';
import { playAiTurn } from './ai';
import { drawTile } from './player';

export function nextTurn() {
  console.log('next turn', bs.turn, bs.activePlayerId);
  bs.turn++;
  bs.activePlayerId = bs.activePlayerId === bs.players[0].id ? bs.players[1].id : bs.players[0].id;
  initPlayerTurn(bs.activePlayerId);
  if (bs.activePlayerId !== LOCAL_PLAYER_ID) {
    playAiTurn();
  }
}

function initPlayerTurn(playerId: number) {
  drawTile(playerId);
}
