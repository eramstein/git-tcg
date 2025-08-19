<script lang="ts">
  import type { TileTemplate } from '@/logic/_model';

  let { tile } = $props<{ tile: TileTemplate }>();

  let imageSrc = $derived(`/src/assets/images/tiles/${tile.templateId}.jpg`);
</script>

<div class="tile-deployed">
  <div class="tile-deployed__name">{tile.name}</div>
  <img class="tile-deployed__image" src={imageSrc} alt={tile.name} />
</div>

<style>
  .tile-deployed {
    position: relative;
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .tile-deployed__name {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    font-weight: bold;
    text-align: center;
    padding: 0.25rem;
    font-size: 0.75rem;
    opacity: 0;
    transition: opacity 0.2s ease;
    z-index: 10;
  }

  .tile-deployed:hover .tile-deployed__name {
    opacity: 1;
  }

  .tile-deployed__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
  }
</style>
