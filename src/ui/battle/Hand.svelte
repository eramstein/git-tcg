<script lang="ts">
  import Tile from './Tile.svelte';
  import type { Player, Tile as TileType } from '@/logic/_model';
  import { bs } from '@/ui/ui-state.svelte';

  let {
    player,
    vertical = false,
    faceDown = false,
  } = $props<{ player: Player; vertical?: boolean; faceDown?: boolean }>();
  let tilesInHand = $derived(player.hand);
  let hasNoCards = $derived(tilesInHand.length === 0);
  let isPlayerActive = $derived(bs.activePlayerId === player.id);
  let canDrag = $derived(!faceDown && isPlayerActive);

  // Handle drag start
  function handleDragStart(event: DragEvent, tile: TileType) {
    if (event.dataTransfer) {
      event.dataTransfer.setData('application/json', JSON.stringify(tile));
      event.dataTransfer.effectAllowed = 'move';
    }
  }
</script>

<div class="hand" class:hand--vertical={vertical}>
  {#if hasNoCards}
    <div class="hand__empty">No cards in hand</div>
  {:else}
    {#each tilesInHand as tile (tile.id)}
      <div
        class="hand__tile"
        class:hand__tile--inactive={!isPlayerActive}
        draggable={canDrag}
        ondragstart={canDrag ? (e) => handleDragStart(e, tile) : undefined}
      >
        {#if faceDown}
          <div class="tile-back">
            <img class="tile-back__image" src="/src/assets/images/card_back.jpg" alt="Card Back" />
          </div>
        {:else}
          <Tile {tile} />
        {/if}
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

  .hand--vertical {
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .hand__tile {
    flex: 0 0 auto;
    cursor: grab;
    width: 120px;
    height: 120px;
    transition: opacity 0.3s ease;
  }

  .hand__tile--inactive {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* In vertical layout, tiles keep their intrinsic width and are centered via align-items */

  .hand__tile:active {
    cursor: grabbing;
  }

  .hand__tile--inactive:active {
    cursor: not-allowed;
  }

  .tile-back {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .tile-back__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
  }

  .hand__empty {
    color: #777;
    font-style: italic;
  }
</style>
