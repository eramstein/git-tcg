import type { BattleState, Position, Tile, TileDeployed } from '../_model';
import { UiHintType } from '../_model/enums';
import { nextTurn } from './turn';
import { executeAttacks } from './combat';

export function playTile(bs: BattleState, tile: Tile, position: Position) {
  bs.uiHints.push({ type: UiHintType.playTile, args: { tile, position } });
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
  nextTurn(bs);
}

export function damageTile(
  bs: BattleState,
  tile: TileDeployed,
  amount: number,
  source?: TileDeployed
) {
  bs.uiHints.push({ type: UiHintType.damageTile, args: { tile, amount, source } });
  tile.health -= amount;
  if (tile.health <= 0) {
    destroyTile(bs, tile, source);
  }
}

export function destroyTile(bs: BattleState, tile: TileDeployed, source?: TileDeployed) {
  bs.uiHints.push({ type: UiHintType.destroyTile, args: { tile, source } });
  tile.destroyed = true;
  if (source) {
    bs.players[source.ownerId].score += 1;
  }
}
