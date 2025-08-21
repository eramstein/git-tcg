/* 
Mocks sending actions to server.
*/

import { UiHintType, type Position, type Tile } from '@/logic/_model';
import { bs } from '@/ui/ui-state.svelte';
import { soundManager } from '@/ui/sound';

// Audio and visual feedback for actions
function playActionsFeedback() {
  bs.uiHints.forEach((hint) => {
    switch (hint.type) {
      case UiHintType.playTile:
        soundManager.playDeploySound();
        break;
      case UiHintType.damageTile:
        soundManager.playAttackSound(hint.args.amount);
        // Trigger visual damage effect
        if (hint.args.tile) {
          window.dispatchEvent(
            new CustomEvent('tileDamaged', {
              detail: {
                tileId: hint.args.tile.id,
                damageAmount: hint.args.amount,
              },
            })
          );
        }
        break;
      case UiHintType.destroyTile:
        soundManager.playDestroySound();
        break;
    }
  });
}

const wsUrl = import.meta.env.VITE_WS_URL ?? `ws://${location.hostname}:8080`;
const ws = new WebSocket(wsUrl);

ws.addEventListener('open', () => {
  console.log('Connected to server ✅');
});

// Listen for updates from server
ws.addEventListener('message', (event) => {
  const msg = JSON.parse(event.data);
  console.log('Received message:', msg);
  if (msg.type === 'state') {
    Object.assign(bs, msg.state);
    playActionsFeedback();
    // for mock PoC, simulate other player
    // window.setTimeout(() => {
    //   const aiActions = playAiTurn();
    //   if (aiActions) {
    //     dropTile(1 - msg.state.activePlayerId, aiActions.tile, aiActions.position);
    //   }
    // }, 1000);
  }
});

export function dropTile(playerId: number, tile: Tile, position: Position) {
  ws.send(
    JSON.stringify({
      type: 'action',
      playerId,
      payload: { type: 'playTile', tile, position },
    })
  );
}

// Server-side storage functions via WebSocket
export function loadGameStateFromServer() {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'loadState' }));
    console.log('Requested state load from server');
  } else {
    console.error('WebSocket not connected');
  }
}

export function saveStateToServer() {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'saveState' }));
    console.log('Requested state save to server');
  } else {
    console.error('WebSocket not connected');
  }
}

export function resetBattleState() {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'resetState' }));
    console.log('Requested battle state reset from server');
  } else {
    console.error('WebSocket not connected');
  }
}
