<script lang="ts">
  import type { TileDeployed } from '@/logic/_model';

  let { tile, localPlayerId } = $props<{ tile: TileDeployed; localPlayerId: number }>();

  let imageSrc = $derived(`/src/assets/images/tiles/${tile.templateId}.jpg`);
  let isLocalPlayerTile = $derived(tile.ownerId === localPlayerId);
  let shouldShowHealth = $derived(tile.health > 0);
  let isHealthDamaged = $derived(tile.health < tile.maxHealth);

  let isDamaged = $state(false);
  let damageAmount = $state(0);

  // Listen for damage events
  $effect(() => {
    const handleTileDamaged = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail.tileId === tile.id) {
        damageAmount = customEvent.detail.damageAmount;
        isDamaged = true;

        // Reset damage effect after animation
        setTimeout(() => {
          isDamaged = false;
        }, 600);
      }
    };

    window.addEventListener('tileDamaged', handleTileDamaged);

    return () => {
      window.removeEventListener('tileDamaged', handleTileDamaged);
    };
  });
</script>

<div class="tile-deployed" class:destroyed={tile.destroyed} class:damaged={isDamaged}>
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
  {#if isDamaged}
    <div class="tile-deployed__damage-effect">
      -{damageAmount}
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
    transition: filter 0.3s ease;
  }

  .tile-deployed.destroyed {
    filter: grayscale(100%);
  }

  .tile-deployed.damaged {
    filter: brightness(1.3) saturate(1.5) hue-rotate(0deg);
    animation: damage-flash 0.6s ease-out;
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

  .tile-deployed__damage-effect {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 24px;
    font-weight: bold;
    color: #ff0000;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
    z-index: 10;
    animation: damage-number 0.6s ease-out forwards;
    pointer-events: none;
  }

  @keyframes damage-flash {
    0% {
      filter: brightness(1) saturate(1) hue-rotate(0deg);
    }
    50% {
      filter: brightness(1.5) saturate(2) hue-rotate(0deg);
    }
    100% {
      filter: brightness(1) saturate(1) hue-rotate(0deg);
    }
  }

  @keyframes damage-number {
    0% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.5);
    }
    20% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1.2);
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -100%) scale(1);
    }
  }
</style>
