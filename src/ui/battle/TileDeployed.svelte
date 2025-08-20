<script lang="ts">
  import type { TileDeployed } from '@/logic/_model';

  let { tile, localPlayerId } = $props<{ tile: TileDeployed; localPlayerId: number }>();

  let imageSrc = $derived(`/src/assets/images/tiles/${tile.templateId}.jpg`);
  let isLocalPlayerTile = $derived(tile.ownerId === localPlayerId);
  let shouldShowHealth = $derived(tile.health > 0);
  let isHealthDamaged = $derived(tile.health < tile.maxHealth);
</script>

<div class="tile-deployed" class:destroyed={tile.destroyed}>
  <img class="tile-deployed__image" src={imageSrc} alt={tile.name} />
  {#if shouldShowHealth}
    <div
      class="tile-deployed__health"
      class:local-player={isLocalPlayerTile}
      class:damaged={isHealthDamaged}
    >
      {tile.health}
    </div>
  {/if}
</div>

<style>
  .tile-deployed {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .tile-deployed.destroyed {
    filter: grayscale(100%);
  }

  .tile-deployed__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
    border-bottom-right-radius: 40px;
    border-top-left-radius: 40px;
  }

  .tile-deployed__health {
    position: absolute;
    bottom: -4px;
    right: 0px;
    font-size: 14px;
    font-weight: bold;
    color: black; /* Default color for opponent tiles */
  }

  .tile-deployed__health.local-player {
    color: white; /* Color for local player tiles */
  }

  .tile-deployed__health.local-player.damaged {
    color: #fc7272 !important; /* Light red for damaged local player tiles */
  }

  .tile-deployed__health.damaged:not(.local-player) {
    color: #e22c18 !important; /* Dark red for damaged opponent tiles */
  }
</style>
