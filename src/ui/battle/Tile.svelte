<script lang="ts">
  import type { TileTemplate } from '@/logic/_model';

  let { tile } = $props<{ tile: TileTemplate }>();

  let imageSrc = $derived(`/src/assets/images/tiles/${tile.templateId}.jpg`);
</script>

<div class="tile">
  <div class="tile__name">{tile.name}</div>
  <img class="tile__image" src={imageSrc} alt={tile.name} />
</div>

<style>
  .tile {
    position: relative;
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .tile__name {
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

  .tile:hover .tile__name {
    opacity: 1;
  }

  .tile__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
  }
</style>
