import type { BattleState, TileDeployed } from '../_model';
import { getAdjacentTiles } from './board';
import { damageTile } from './tile';

export function executeAttacks(bs: BattleState, attacker: TileDeployed) {
  const defenders = getAdjacentTiles(bs, attacker.position).filter(
    (t) => t.ownerId !== attacker.ownerId
  );
  defenders.forEach((defender, i) => {
    damageTile(bs, defender, attacker.power, attacker);
  });
}
