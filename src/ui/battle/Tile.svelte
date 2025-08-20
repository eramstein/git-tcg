<script lang="ts">
  import type { TileTemplate } from '@/logic/_model';

  let { tile } = $props<{ tile: TileTemplate }>();

  let imageSrc = $derived(`/src/assets/images/tiles/${tile.templateId}.jpg`);
</script>

<div class="tile">
  <img class="tile__image" src={imageSrc} alt={tile.name} />
  <div class="tile__power">{tile.power}</div>
  <div class="tile__health">{tile.maxHealth}</div>
</div>

<style>
  .tile {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .tile__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
  }

  .tile__power {
    position: absolute;
    bottom: 4px;
    left: 4px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    font-size: 12px;
    font-weight: bold;
    padding: 2px 6px;
    border-radius: 3px;
    min-width: 16px;
    text-align: center;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .tile__health {
    position: absolute;
    bottom: 4px;
    right: 4px;
    background: rgba(220, 53, 69, 0.9);
    color: white;
    font-size: 12px;
    font-weight: bold;
    padding: 2px 6px;
    border-radius: 3px;
    min-width: 16px;
    text-align: center;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .tile:hover .tile__power,
  .tile:hover .tile__health {
    opacity: 1;
  }
</style>
