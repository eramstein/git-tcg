<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { handleKeybinds } from '@/ui/_keybinds/keybinds';
  import { loadGameStateFromLocalStorage, bs } from '@/logic/_state/battle.svelte';
  import { initBattle } from '@/logic/battle/init';

  import Battle from '@/ui/battle/Battle.svelte';

  let isLoading = $state(true);

  onMount(async () => {
    window.addEventListener('keydown', handleKeybinds);

    try {
      // Load saved game state if it exists
      await loadGameStateFromLocalStorage();
      if (bs.turn === 0) {
        await initBattle();
      }
    } catch (error) {
      console.error('Failed to initialize game:', error);
    } finally {
      isLoading = false;
    }
  });

  onDestroy(() => {
    window.removeEventListener('keydown', handleKeybinds);
  });
</script>

<Battle />
