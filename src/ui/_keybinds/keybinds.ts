import {
  loadGameStateFromLocalStorage,
  saveStateToLocalStorage,
  resetBattleState,
} from '@/server/storage';
import { bs } from '@/ui/ui-state.svelte';
import { state } from '@/server/server';

export function handleKeybinds(event: KeyboardEvent) {
  // Skip keybinds if user is typing in an input field
  const target = event.target as HTMLElement;
  if (
    target &&
    (target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.contentEditable === 'true' ||
      target.closest('[contenteditable="true"]'))
  ) {
    return;
  }

  if (event.key === 'F4') {
    event.preventDefault();
    const loadedState = loadGameStateFromLocalStorage();
    console.log('State reloaded from localStorage', loadedState);
  } else if (event.key === 'F5') {
    event.preventDefault();
    saveStateToLocalStorage();
    console.log('State saved to localStorage');
  } else if (event.key === 'r') {
    event.preventDefault();
    resetBattleState();
    console.log('Battle state reset');
  }
}
