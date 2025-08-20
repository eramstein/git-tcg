import { bs, ui } from '@/ui/ui-state.svelte';
import { loadGameStateFromServer, saveStateToServer, resetBattleState } from '@/ui/battle/actions';

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
    loadGameStateFromServer();
  } else if (event.key === 'F5') {
    event.preventDefault();
    saveStateToServer();
  } else if (event.key === 'r') {
    event.preventDefault();
    resetBattleState();
  } else if (event.key === ' ') {
    event.preventDefault();
    ui.localPlayerId = 1 - ui.localPlayerId;
  }
}
