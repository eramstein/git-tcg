<script lang="ts">
  import type { TileTemplate } from '@/logic/_model';

  let { tile } = $props<{ tile: TileTemplate }>();

  let imageSrc = $derived(`/src/assets/images/tiles/${tile.templateId}.jpg`);
</script>

<div class="tile-deployed">
  <img class="tile-deployed__image" src={imageSrc} alt={tile.name} />
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

  .tile-deployed__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 20px;
  }
</style>
