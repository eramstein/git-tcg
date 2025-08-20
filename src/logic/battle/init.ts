import { FOE_TILES, loadGameData, PLAYER_TILES } from '@/data';
import { drawTile } from './player';
import type { BattleState } from '../_model';

export const defaultBattleState: BattleState = {
  turn: 0,
  activePlayerId: 0,
  victoriousPlayerId: null,
  players: [],
  tiles: [],
  uiHints: [],
};

export const initBattle = async (bs: BattleState) => {
  console.log('initBattle - loading game data...');

  // Wait for game data to load before proceeding
  await loadGameData();

  console.log('initBattle - game data loaded, initializing battle...');

  bs.turn = 1;
  bs.players = [
    {
      id: 0,
      name: 'Henry',
      score: 0,
      hand: [],
      deck: PLAYER_TILES().map((tile) => ({ ...tile, ownerId: 0, id: crypto.randomUUID() })),
    },
    {
      id: 1,
      name: 'Ousmane',
      score: 0,
      hand: [],
      deck: FOE_TILES().map((tile) => ({ ...tile, ownerId: 1, id: crypto.randomUUID() })),
    },
  ];
  bs.tiles = [];

  for (let playerId = 0; playerId < bs.players.length; playerId++) {
    for (let i = 0; i < 5; i++) {
      drawTile(bs, playerId);
    }
  }

  console.log('initBattle - battle initialized successfully');
};
