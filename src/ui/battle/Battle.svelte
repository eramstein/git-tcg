<script lang="ts">
  import { bs, LOCAL_PLAYER_ID } from '@/ui/ui-state.svelte';
  import Player from './Player.svelte';
  import Board from './Board.svelte';
  import Hand from './Hand.svelte';

  let localPlayer = $derived(bs.players.find((p) => p.id === LOCAL_PLAYER_ID));
  let foePlayer = $derived(bs.players.find((p) => p.id !== LOCAL_PLAYER_ID));
  let victoriousPlayer = $derived(
    bs.victoriousPlayerId !== null ? bs.players.find((p) => p.id === bs.victoriousPlayerId) : null
  );
</script>

<div class="battle">
  <div class="battle__main">
    <div class="battle__side battle__side--left">
      {#if localPlayer}
        <Player player={localPlayer} />
        <div class="battle__hand">
          <Hand player={localPlayer} vertical={true} />
        </div>
      {/if}
    </div>

    <div class="battle__board">
      <Board />
    </div>

    <div class="battle__side battle__side--right">
      {#if foePlayer}
        <Player player={foePlayer} />
        <div class="battle__hand">
          <Hand player={foePlayer} vertical={true} faceDown={true} />
        </div>
      {/if}
    </div>
  </div>

  {#if victoriousPlayer}
    <div class="victory-modal">
      <div class="victory-modal__content">
        <h2 class="victory-modal__title">Victory!</h2>
        <p class="victory-modal__winner">{victoriousPlayer.name} wins!</p>
        <p class="victory-modal__score">Final Score: {victoriousPlayer.score}</p>
      </div>
    </div>
  {/if}
</div>

<style>
  .battle {
    display: grid;
    grid-template-rows: 1fr;
    gap: 1rem;
    height: calc(100vh - 2rem);
    padding: 1rem;
    box-sizing: border-box;
    position: relative;
  }

  .battle__main {
    display: grid;
    grid-template-columns: 240px 1fr 240px;
    gap: 1rem;
    align-items: start;
    height: 100%;
  }

  .battle__board {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .battle__side {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    height: 100%;
    overflow: hidden;
  }

  .battle__hand {
    flex: 1;
    overflow: auto;
  }

  .victory-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .victory-modal__content {
    background-color: white;
    padding: 2rem;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    max-width: 400px;
    width: 90%;
  }

  .victory-modal__title {
    font-size: 2rem;
    font-weight: bold;
    color: #2c3e50;
    margin: 0 0 1rem 0;
  }

  .victory-modal__winner {
    font-size: 1.2rem;
    color: #34495e;
    margin: 0 0 0.5rem 0;
  }

  .victory-modal__score {
    font-size: 1rem;
    color: #7f8c8d;
    margin: 0 0 2rem 0;
    font-weight: 500;
  }

  .victory-modal__button {
    background-color: #3498db;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .victory-modal__button:hover {
    background-color: #2980b9;
  }
</style>
