/*
  Mocks a Node.js websocket server.
  It's used to test the client-side logic without relying on a real server.
*/

import type { BattleState } from '@/logic/_model';
import { defaultBattleState, initBattle } from '@/logic/battle/init';
import { loadGameStateFromLocalStorage } from './storage';
import { playTile } from '@/logic/battle/tile';

export let state: BattleState = { ...defaultBattleState };

export async function connectToServer(): Promise<BattleState> {
  await loadGameStateFromLocalStorage();
  if (state.turn === 0) {
    await initBattle(state);
  }
  return state;
}

export function handleAction(action: any, playerId: number): BattleState {
  state.uiHints = [];
  if (playerId !== state.activePlayerId) {
    console.error('Invalid player id', playerId, state.activePlayerId);
    return state;
  }
  switch (action.type) {
    case 'playTile':
      // TODO: validate action
      playTile(state, action.tile, action.position);
      break;
  }
  return state;
}

// TODO: Setup WebSocket server: listen to connections, messages, and broadcast new states
// ----------------------------------------------------
// const wss = new WebSocketServer({ port: 8080 });

// wss.on("connection", (ws) => {
//   console.log("Client connected");

//   // Send initial state
//   ws.send(JSON.stringify({ type: "state", state, log: ["Game started"] }));

//   ws.on("message", (message) => {
//     const { type, payload, playerId } = JSON.parse(message.toString());

//     if (type === "action") {
//       const result = handleAction(payload, playerId);

//       // Broadcast new state to all clients
//       wss.clients.forEach((client) => {
//         if (client.readyState === ws.OPEN) {
//           client.send(JSON.stringify({ type: "state", ...result }));
//         }
//       });
//     }
//   });
// });
