/* 
Mocks sending actions to server.
*/

import { UiHintType, type Position, type Tile } from '@/logic/_model';
import { handleAction } from '@/server/server';
import { bs } from '@/ui/ui-state.svelte';
import { playAiTurn } from './ai';
import { soundManager } from '@/ui/sound';

export function dropTile(playerId: number, tile: Tile, position: Position) {
  const newState = handleAction({ type: 'playTile', tile, position }, playerId);
  // normally the new state would come from the websocket server
  Object.assign(bs, newState);
  playActionsFeedback();
  // for mock PoC, simulate other player
  window.setTimeout(() => {
    const aiActions = playAiTurn();
    if (aiActions) {
      const stateAfterAi = handleAction(
        { type: 'playTile', tile: aiActions.tile, position: aiActions.position },
        1 - playerId
      );
      Object.assign(bs, stateAfterAi);
      playActionsFeedback();
    }
  }, 1000);
}

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

// TODO: Setup WebSocket client: listen to updates from server
// ----------------------------------------------------
// const ws = new WebSocket("ws://localhost:8080");

// // Listen for updates from server
// ws.addEventListener("message", (event) => {
//   const msg = JSON.parse(event.data);

//   if (msg.type === "state") {
//     gameState.set(msg.state);
//     log.set(msg.log);
//   }
// });
