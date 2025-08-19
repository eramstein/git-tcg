<script lang="ts">
  import { bs, LOCAL_PLAYER_ID } from '@/logic/_state/battle.svelte';
  import Player from './Player.svelte';
  import Board from './Board.svelte';
  import Hand from './Hand.svelte';

  let localPlayer = $derived(bs.players.find((p) => p.id === LOCAL_PLAYER_ID));
  let foePlayer = $derived(bs.players.find((p) => p.id !== LOCAL_PLAYER_ID));
</script>

<div class="battle">
  <div class="battle__main">
    <div class="battle__side battle__side--left">
      {#if localPlayer}
        <Player player={localPlayer} />
      {/if}
    </div>

    <div class="battle__board">
      <Board />
    </div>

    <div class="battle__side battle__side--right">
      {#if foePlayer}
        <Player player={foePlayer} />
      {/if}
    </div>
  </div>

  <div class="battle__hand">
    {#if localPlayer}
      <Hand player={localPlayer} />
    {/if}
  </div>
</div>

<style>
  .battle {
    display: grid;
    grid-template-rows: 1fr auto;
    gap: 1rem;
    min-height: 100vh;
    padding: 1rem;
    box-sizing: border-box;
  }

  .battle__main {
    display: grid;
    grid-template-columns: 240px 1fr 240px;
    gap: 1rem;
    align-items: start;
  }

  .battle__board {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .battle__hand {
    padding-top: 0.5rem;
  }
</style>
