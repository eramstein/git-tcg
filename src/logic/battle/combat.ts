import type { BattleState, TileDeployed } from '../_model';
import { getAdjacentTiles } from './board';
import { damageTile } from './tile';
import { soundManager } from '@/ui/sound';

export function executeAttacks(bs: BattleState, attacker: TileDeployed) {
  const defenders = getAdjacentTiles(bs, attacker.position).filter(
    (t) => t.ownerId !== attacker.ownerId
  );
  defenders.forEach((defender, i) => {
    damageTile(bs, defender, attacker.power, attacker);
    window.setTimeout(
      () => {
        soundManager.playAttackSound(attacker.power);
      },
      200 + i * 350
    );
  });
}
