import type { UiHintType } from './enums';

export interface BattleState {
  turn: number;
  activePlayerId: number;
  victoriousPlayerId: number | null;
  players: Player[];
  tiles: TileDeployed[];
  uiHints: UiHint[];
}

export interface Player {
  id: number;
  name: string;
  score: number;
  hand: Tile[];
  deck: Tile[];
}

export interface TileTemplate {
  templateId: string;
  name: string;
  power: number;
  maxHealth: number;
}

export interface Tile extends TileTemplate {
  id: string;
  ownerId: number;
}

export interface TileDeployed extends Tile {
  position: Position;
  destroyed: boolean;
  health: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface UiHint {
  type: UiHintType;
  args: any;
}
