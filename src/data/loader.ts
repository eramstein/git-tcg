import type { TileTemplate } from '@/logic/_model';

import decksData from './decks.json';

// Get unique tile IDs from both decks
const playerTileIds = new Set(decksData.player);
const foeTileIds = new Set(decksData.foe);
const allTileIds = new Set<string>([...playerTileIds, ...foeTileIds]);

// Only load tiles that are actually used in the decks
export const tiles: Record<string, TileTemplate> = {};

// Function to load game data - this will be called when the game starts
export async function loadGameData() {
  // Load individual tile files
  for (const tileId of allTileIds) {
    try {
      const tileModule = await import(`./tiles/${tileId}.json`);
      tiles[tileId] = tileModule.default as TileTemplate;
    } catch (error) {
      console.error(`Failed to load tile: ${tileId}`, error);
    }
  }
}

// These functions will return the deck data after loading
export const PLAYER_TILES = () => decksData.player.map((tileId) => tiles[tileId]);
export const FOE_TILES = () => decksData.foe.map((tileId) => tiles[tileId]);
