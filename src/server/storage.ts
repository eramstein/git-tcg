/*
  Server-side persistence layer using file system.
*/
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import type { BattleState } from '../logic/_model';
import { defaultBattleState } from '../logic/battle/init';
import { state } from './server';

const STORAGE_DIR = join(process.cwd(), 'data');
const BATTLE_STATE_FILE = join(STORAGE_DIR, 'battle-state.json');

// Ensure storage directory exists
function ensureStorageDir() {
  if (!existsSync(STORAGE_DIR)) {
    mkdirSync(STORAGE_DIR, { recursive: true });
  }
}

export const saveStateToLocalStorage = (): void => {
  try {
    ensureStorageDir();
    writeFileSync(BATTLE_STATE_FILE, JSON.stringify(state, null, 2));
    console.log('State saved to file:', BATTLE_STATE_FILE);
  } catch (error) {
    console.error('Failed to save state to file:', error);
  }
};

export const loadGameStateFromLocalStorage = async () => {
  try {
    if (!existsSync(BATTLE_STATE_FILE)) {
      console.log('No saved state found, using default');
      return {};
    }

    const savedBattleState = readFileSync(BATTLE_STATE_FILE, 'utf8');
    const parsedBattleState: BattleState = JSON.parse(savedBattleState);
    Object.assign(state, parsedBattleState);
    console.log('State loaded from file:', BATTLE_STATE_FILE);
  } catch (error) {
    console.error('Failed to load state from file:', error);
    return null;
  }
};

export const resetBattleState = (): void => {
  try {
    // Reset to default battle state
    Object.assign(state, { ...defaultBattleState });
    // Save the reset state to file
    saveStateToLocalStorage();
    console.log('Battle state reset and saved');
  } catch (error) {
    console.error('Failed to reset battle state:', error);
  }
};
