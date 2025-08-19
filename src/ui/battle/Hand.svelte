<script lang="ts">
  import Tile from './Tile.svelte';
  import type { Player, Tile as TileType } from '@/logic/_model';

  let { player } = $props<{ player: Player }>();
  let tilesInHand = $derived(player.hand);
  let hasNoCards = $derived(tilesInHand.length === 0);

  // Handle drag start
  function handleDragStart(event: DragEvent, tile: TileType) {
    if (event.dataTransfer) {
      event.dataTransfer.setData('application/json', JSON.stringify(tile));
      event.dataTransfer.effectAllowed = 'move';
    }
  }
</script>

<div class="hand">
  {#if hasNoCards}
    <div class="hand__empty">No cards in hand</div>
  {:else}
    {#each tilesInHand as tile (tile.id)}
      <div class="hand__tile" draggable="true" ondragstart={(e) => handleDragStart(e, tile)}>
        <Tile {tile} />
      </div>
    {/each}
  {/if}
</div>

<style>
  .hand {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem;
    overflow-x: auto;
  }

  .hand__tile {
    flex: 0 0 auto;
    width: 120px;
    cursor: grab;
  }

  .hand__tile:active {
    cursor: grabbing;
  }

  .hand__empty {
    color: #777;
    font-style: italic;
  }
</style>
