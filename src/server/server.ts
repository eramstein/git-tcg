/*
  Mocks a Node.js websocket server.
  It's used to test the client-side logic without relying on a real server.
*/
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
dotenv.config();
import type { BattleState } from '../logic/_model';
import { defaultBattleState, initBattle } from '../logic/battle/init';
import { loadGameStateFromLocalStorage, saveStateToLocalStorage } from './storage';
import { playTile } from '../logic/battle/tile';

export let state: BattleState = { ...defaultBattleState };

const PORT = Number(process.env.PORT) || 8080;
const HOST = process.env.HOST || '0.0.0.0';

function handleAction(action: any, playerId: number): BattleState {
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

const wss = new WebSocketServer({ port: PORT, host: HOST });
console.log(`WebSocket server listening on ws://${HOST}:${PORT}`);

wss.on('connection', async (ws) => {
  console.log('Client connected');

  await loadGameStateFromLocalStorage();
  if (state.turn === 0) {
    await initBattle(state);
  }

  // Send initial state
  ws.send(JSON.stringify({ type: 'state', state, log: ['Game started'] }));

  ws.on('message', (message) => {
    const { type, payload, playerId } = JSON.parse(message.toString());

    if (type === 'action') {
      const result = handleAction(payload, playerId);
      // Broadcast new state to all clients
      wss.clients.forEach((client) => {
        if (client.readyState === ws.OPEN) {
          client.send(JSON.stringify({ type: 'state', state: result }));
        }
      });
    } else if (type === 'saveState') {
      saveStateToLocalStorage();
      ws.send(JSON.stringify({ type: 'saveStateResponse', success: true }));
    } else if (type === 'loadState') {
      loadGameStateFromLocalStorage();
      ws.send(JSON.stringify({ type: 'state', state }));
    } else if (type === 'resetState') {
      // Reset to default battle state
      Object.assign(state, { ...defaultBattleState });
      saveStateToLocalStorage();
      ws.send(JSON.stringify({ type: 'state', state }));
    }
  });
});
