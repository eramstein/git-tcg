<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { handleKeybinds } from '@/ui/_keybinds/keybinds';
  import { connectToServer } from '@/server/server';
  import { bs } from '@/ui/ui-state.svelte';

  import Battle from '@/ui/battle/Battle.svelte';

  onMount(async () => {
    window.addEventListener('keydown', handleKeybinds);

    const loadedState = await connectToServer();
    Object.assign(bs, loadedState);
  });

  onDestroy(() => {
    window.removeEventListener('keydown', handleKeybinds);
  });
</script>

<Battle />
