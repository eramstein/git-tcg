export interface BattleState {
  turn: number;
  activePlayerId: number;
  victoriousPlayerId: number | null;
  players: Player[];
  tiles: TileDeployed[];
}

export interface Player {
  id: number;
  name: string;
  score: number;
  hand: Tile[];
  deck: Tile[];
  graveyard: Tile[];
}

export interface TileTemplate {
  templateId: string;
  name: string;
}

export interface Tile extends TileTemplate {
  id: string;
  ownerId: number;
}

export interface TileDeployed extends Tile {
  position: Position;
}

export interface Position {
  x: number;
  y: number;
}
