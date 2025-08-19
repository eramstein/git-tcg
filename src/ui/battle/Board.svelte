<script lang="ts">
  import { bs, LOCAL_PLAYER_ID } from '@/logic/_state/battle.svelte';
  import { dropTile } from '@/logic/battle/_actions';
  import { getPossiblePositions } from '@/logic/battle/board';
  import type { Position, Tile } from '@/logic/_model';
  import TileDeployedComponent from './TileDeployed.svelte';

  // Grid configuration - use CSS variable for consistency
  const CELL_SIZE = 100; // Match the --tile-size CSS variable

  // Large underlying board size
  const BOARD_SIZE = 50; // 50x50 grid
  const CENTER_OFFSET = Math.floor(BOARD_SIZE / 2);

  // Camera/viewport state - start camera centered on the board
  let cameraX = $state(-2500);
  let cameraY = $state(-2500);
  let isDragging = $state(false);
  let lastMouseX = $state(0);
  let lastMouseY = $state(0);

  // Viewport reference for measuring
  let viewportElement: HTMLDivElement | undefined;

  // Reactive state for drag and drop
  let draggedTile: Tile | null = $state(null);
  let possiblePositions: Position[] = $state([]);

  // Check if a position is a valid drop target
  function isValidDropPosition(position: Position): boolean {
    return possiblePositions.some((pos) => pos.x === position.x && pos.y === position.y);
  }

  // Handle drag over
  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  // Handle drop
  function handleDrop(event: DragEvent, position: Position) {
    event.preventDefault();

    if (!draggedTile || !isValidDropPosition(position)) {
      return;
    }

    // Call the dropTile action
    dropTile(LOCAL_PLAYER_ID, draggedTile, position);

    // Reset drag state
    draggedTile = null;
    possiblePositions = [];
  }

  // Convert grid position to CSS position with camera offset
  function getCellStyle(x: number, y: number) {
    // Convert grid coordinates to absolute board coordinates
    const boardX = (x + CENTER_OFFSET) * CELL_SIZE;
    const boardY = (y + CENTER_OFFSET) * CELL_SIZE;

    // Apply camera offset to show the correct portion
    const left = boardX + cameraX;
    const top = boardY + cameraY;

    return `left: ${left}px; top: ${top}px;`;
  }

  // Camera panning handlers
  function handleMouseDown(event: MouseEvent) {
    if (event.button === 0) {
      // Left click only
      isDragging = true;
      lastMouseX = event.clientX;
      lastMouseY = event.clientY;
      event.preventDefault();
    }
  }

  function handleMouseMove(event: MouseEvent) {
    if (isDragging) {
      const deltaX = event.clientX - lastMouseX;
      const deltaY = event.clientY - lastMouseY;

      cameraX += deltaX;
      cameraY += deltaY;

      lastMouseX = event.clientX;
      lastMouseY = event.clientY;
      event.preventDefault();
    }
  }

  function handleMouseUp() {
    isDragging = false;
  }

  // Listen for drag events from Hand component
  $effect(() => {
    const handleGlobalDragStart = (event: DragEvent) => {
      const target = event.target as HTMLElement;
      if (target?.closest('.hand__tile')) {
        // Store the tile data for later use
        const tileData = event.dataTransfer?.getData('application/json');
        if (tileData) {
          try {
            draggedTile = JSON.parse(tileData);
            // Compute possible positions when drag starts
            possiblePositions = getPossiblePositions();
          } catch (error) {
            console.error('Failed to parse dragged tile data:', error);
          }
        }
      }
    };

    const handleGlobalDragEnd = () => {
      // Reset drag state when drag ends
      draggedTile = null;
      possiblePositions = [];
    };

    document.addEventListener('dragstart', handleGlobalDragStart);
    document.addEventListener('dragend', handleGlobalDragEnd);

    return () => {
      document.removeEventListener('dragstart', handleGlobalDragStart);
      document.removeEventListener('dragend', handleGlobalDragEnd);
    };
  });

  // Center camera on viewport when component mounts and viewport size changes
  $effect(() => {
    if (viewportElement) {
      // Use requestAnimationFrame to ensure the element is fully rendered
      requestAnimationFrame(() => {
        const rect = viewportElement!.getBoundingClientRect();
        const viewportWidth = rect.width;
        const viewportHeight = rect.height;

        // Center the camera: offset by half the viewport size
        cameraX = -2500 + viewportWidth / 2 - CELL_SIZE / 2;
        cameraY = -2500 + viewportHeight / 2 - CELL_SIZE;
      });
    }
  });

  // Global mouse event listeners for panning
  $effect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  });
</script>

<div class="board-container">
  <div
    class="board-viewport"
    bind:this={viewportElement}
    onmousedown={handleMouseDown}
    class:dragging={isDragging}
  >
    <div class="board-grid">
      <!-- Render deployed tiles -->
      {#each bs.tiles as tile}
        <div class="deployed-tile" style={getCellStyle(tile.position.x, tile.position.y)}>
          <TileDeployedComponent {tile} />
        </div>
      {/each}

      <!-- Render possible drop positions when dragging -->
      {#if draggedTile}
        {#each possiblePositions as position}
          <div
            class="drop-position"
            style={getCellStyle(position.x, position.y)}
            ondragover={handleDragOver}
            ondrop={(e) => handleDrop(e, position)}
          ></div>
        {/each}
      {/if}
    </div>
  </div>
</div>

<style>
  .board-container {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    overflow: hidden;
    min-height: 400px;
    height: 100%;
  }

  .board-viewport {
    width: 100%;
    height: 100%;
    min-height: 400px;
    overflow: hidden;
    cursor: grab;
    border: 2px solid #333;
    border-radius: 8px;
    position: relative;
  }

  .board-viewport.dragging {
    cursor: grabbing;
  }

  .board-grid {
    position: absolute;
    width: 5000px; /* 50 * 100px */
    height: 5000px; /* 50 * 100px */
    background: transparent;
  }

  .deployed-tile {
    position: absolute;
    width: var(--tile-size);
    height: var(--tile-size);
  }

  .drop-position {
    position: absolute;
    width: var(--tile-size);
    height: var(--tile-size);
    border: 2px dashed #00aa00;
    background: rgba(0, 255, 0, 0.1);
    animation: pulse 1s infinite;
    cursor: pointer;
  }

  @keyframes pulse {
    0% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.6;
    }
  }
</style>
