/* 
Mocks sending actions to server.
*/

import type { Position, Tile } from '@/logic/_model';
import { handleAction } from '@/server/server';
import { bs } from '@/ui/ui-state.svelte';
import { playAiTurn } from './ai';

export function dropTile(playerId: number, tile: Tile, position: Position) {
  const newState = handleAction({ type: 'playTile', tile, position }, playerId);
  // normally the new state would come from the websocket server
  Object.assign(bs, newState);
  // simulate other player
  window.setTimeout(() => {
    const aiActions = playAiTurn();
    if (aiActions) {
      const stateAfterAi = handleAction(
        { type: 'playTile', tile: aiActions.tile, position: aiActions.position },
        1 - playerId
      );
      Object.assign(bs, stateAfterAi);
    }
  }, 1000);
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
