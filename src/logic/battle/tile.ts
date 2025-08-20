import type { BattleState, Position, Tile, TileDeployed } from '../_model';
import { UiHintType } from '../_model/enums';
import { nextTurn } from './turn';
import { executeAttacks } from './combat';

export function playTile(bs: BattleState, tile: Tile, position: Position) {
  const player = bs.players[tile.ownerId];
  player.hand.splice(player.hand.indexOf(tile), 1);
  const deployedTile: TileDeployed = {
    ...tile,
    position,
    id: crypto.randomUUID(),
    destroyed: false,
    health: tile.maxHealth,
  };
  bs.tiles.push(deployedTile);
  executeAttacks(bs, deployedTile);
  bs.uiHints.push({ type: UiHintType.playTile, args: { tile, position } });
  nextTurn(bs);
}

export function damageTile(
  bs: BattleState,
  tile: TileDeployed,
  amount: number,
  source?: TileDeployed
) {
  tile.health -= amount;
  bs.uiHints.push({ type: UiHintType.attackTile, args: { tile, amount, source } });
  if (tile.health <= 0) {
    destroyTile(bs, tile, source);
  }
}

export function destroyTile(bs: BattleState, tile: TileDeployed, source?: TileDeployed) {
  tile.destroyed = true;
  if (source) {
    bs.players[source.ownerId].score += 1;
  }
  bs.uiHints.push({ type: UiHintType.destroyTile, args: { tile, source } });
}
