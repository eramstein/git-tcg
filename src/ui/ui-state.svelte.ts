import type { BattleState, GameState } from '@/logic/_model';
import { defaultBattleState } from '@/logic/battle/init';

export const gs: GameState = $state({});
export const bs: BattleState = $state({ ...defaultBattleState });

// Read local player ID from URL parameter, default to 0
function getLocalPlayerIdFromUrl(): number {
  const urlParams = new URLSearchParams(window.location.search);
  const playerParam = urlParams.get('player');

  if (playerParam === null) {
    return 0; // Default to player 0
  }

  const playerId = parseInt(playerParam, 10);
  return isNaN(playerId) ? 0 : playerId; // Default to 0 if invalid number
}

export const LOCAL_PLAYER_ID = getLocalPlayerIdFromUrl();
