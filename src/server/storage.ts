/*
  Mocks a persistence layer.
*/

import type { BattleState } from '@/logic/_model';
import { defaultBattleState } from '@/logic/battle/init';
import { state } from './server';

const LOCAL_STORAGE_KEY_BATTLE = 'go-tcg-battle-state';

export const saveStateToLocalStorage = (): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_BATTLE, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
  }
};

export const loadGameStateFromLocalStorage = async () => {
  try {
    const savedBattleState = localStorage.getItem(LOCAL_STORAGE_KEY_BATTLE);
    if (!savedBattleState) return {};

    const parsedBattleState: BattleState = JSON.parse(savedBattleState);
    Object.assign(state, parsedBattleState);
  } catch (error) {
    console.error('Failed to load state from localStorage:', error);
    return null;
  }
};

export const resetBattleState = (): void => {
  try {
    // Reset to default battle state
    Object.assign(state, { ...defaultBattleState });
    // Save the reset state to localStorage
    localStorage.setItem(LOCAL_STORAGE_KEY_BATTLE, JSON.stringify(state));
    console.log('resetBattleState', state);
  } catch (error) {
    console.error('Failed to reset battle state:', error);
  }
};
