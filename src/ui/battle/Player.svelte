<script lang="ts">
  import type { Player } from '@/logic/_model';

  let { player } = $props<{ player: Player }>();

  let deckCount = $derived(player.deck?.length ?? 0);
  let portraitSrc = $derived(`/src/assets/images/characters/${player.name}.jpg`);
</script>

<div class="player">
  <div class="player__portrait">
    <img class="portrait__image" src={portraitSrc} alt={player.name} />
  </div>
  <div class="player__score">{player.score}</div>
  <div class="zone zone--deck">{deckCount} tiles in deck</div>
</div>

<style>
  .player {
    display: flex;
    flex-direction: column;
    padding: 0.5rem;
    align-items: center;
    justify-content: flex-start;
  }

  .player__portrait {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
  }

  .portrait__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .player__score {
    color: #ffffff;
    font-size: 1.5rem;
    font-weight: bold;
  }

  .zone--deck {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 0.25rem;
    color: #bbbbbb;
  }
</style>
