import type { BattleState, GameState } from '@/logic/_model';
import { defaultBattleState } from '@/logic/battle/init';

export const gs: GameState = $state({});
export const bs: BattleState = $state({ ...defaultBattleState });
export const ui = $state({ localPlayerId: 0 });
