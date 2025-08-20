<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { handleKeybinds } from '@/ui/_keybinds/keybinds';

  import Battle from '@/ui/battle/Battle.svelte';

  onMount(async () => {
    window.addEventListener('keydown', handleKeybinds);
  });

  onDestroy(() => {
    window.removeEventListener('keydown', handleKeybinds);
  });
</script>

<Battle />
