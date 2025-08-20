<script lang="ts">
  import type { Player } from '@/logic/_model';

  let { player } = $props<{ player: Player }>();

  let deckCount = $derived(player.deck?.length ?? 0);
  let deckImageSrc = $derived(`/src/assets/images/card_back.jpg`);
  let portraitSrc = $derived(`/src/assets/images/characters/${player.name}.jpg`);
</script>

<div class="player">
  <div class="player__portrait">
    <img class="portrait__image" src={portraitSrc} alt={player.name} />
  </div>

  <div class="player__info">
    <div class="player__name">{player.name}</div>
    <div class="player__score">{player.score}</div>
  </div>

  <div class="player__zones">
    <div class="zone zone--deck">
      <div class="deck">
        <img class="deck__image" src={deckImageSrc} alt="Deck" />
        <div class="deck__count">{deckCount}</div>
      </div>
    </div>
  </div>
</div>

<style>
  .player {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 0.5rem;
    align-items: center;
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

  .player__info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
  }

  .player__name {
    font-weight: bold;
    font-size: 1rem;
    color: #ffffff;
  }

  .player__score {
    color: #ffffff;
    font-size: 1.5rem;
    font-weight: bold;
  }

  .player__zones {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem;
    align-items: center;
  }

  .zone--deck {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .deck {
    position: relative;
    width: 100px;
  }

  .deck__image {
    display: block;
    width: 100%;
    height: auto;
    object-fit: contain;
  }

  .deck__count {
    position: absolute;
    bottom: 4px;
    right: 6px;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    padding: 2px 6px;
    border-radius: 10px;
    font-size: 0.8rem;
  }
</style>
