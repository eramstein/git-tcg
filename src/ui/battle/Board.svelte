<script lang="ts">
  import { bs, ui } from '@/ui/ui-state.svelte';
  import { dropTile } from '@/ui/battle/actions';
  import { getPossiblePositions } from '@/logic/battle/board';
  import type { Position, Tile } from '@/logic/_model';
  import TileDeployedComponent from './TileDeployed.svelte';
  import { cubicOut } from 'svelte/easing';

  // Grid configuration - logical cell size includes a 1px gap around a 130px tile
  const CELL_SIZE = 131; // 130px tile + 1px gap

  // Large underlying board size
  const BOARD_SIZE = 50; // 50x50 grid
  const CENTER_OFFSET = Math.floor(BOARD_SIZE / 2);

  // Camera/viewport state - start camera centered on the board
  let cameraX = $state(-3275);
  let cameraY = $state(-3275);
  let isDragging = $state(false);
  let lastMouseX = $state(0);
  let lastMouseY = $state(0);

  // Visual zoom state (purely visual via CSS transform on the grid)
  let zoom = $state(1);
  const MIN_ZOOM = 0.5;
  const MAX_ZOOM = 2.5;
  const ZOOM_STEP = 0.1;

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
    dropTile(ui.localPlayerId, draggedTile, position);

    // Reset drag state
    draggedTile = null;
    possiblePositions = [];
  }

  // Convert grid position to CSS position with camera offset (positions are in world units; zoom is visual only)
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

      // Adjust for current zoom so panning matches cursor movement
      cameraX += deltaX / zoom;
      cameraY += deltaY / zoom;

      lastMouseX = event.clientX;
      lastMouseY = event.clientY;
      event.preventDefault();
    }
  }

  function handleMouseUp() {
    isDragging = false;
  }

  // Mouse wheel zoom handler (visual scaling around cursor)
  function handleWheel(event: WheelEvent) {
    event.preventDefault();
    if (!viewportElement) return;

    const rect = viewportElement.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const direction = Math.sign(event.deltaY); // 1 = zoom out, -1 = zoom in (on most systems)
    const targetZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom * (1 - direction * ZOOM_STEP)));
    if (targetZoom === zoom) return;

    // World coords under cursor before zoom
    const worldX = mouseX / zoom - cameraX;
    const worldY = mouseY / zoom - cameraY;

    // Update zoom and adjust camera so the point under cursor stays pinned
    zoom = targetZoom;
    cameraX = mouseX / zoom - worldX;
    cameraY = mouseY / zoom - worldY;
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
            possiblePositions = getPossiblePositions(bs);
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
        cameraX = -3275 + viewportWidth / 2 - CELL_SIZE / 2;
        cameraY = -3275 + viewportHeight / 2 - CELL_SIZE;
      });
    }
  });

  // Global mouse event listeners for panning
  $effect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    if (viewportElement) {
      viewportElement.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      if (viewportElement) {
        viewportElement.removeEventListener('wheel', handleWheel as EventListener);
      }
    };
  });

  // Function to get background color based on tile owner
  function getTileBackgroundColor(ownerId: number): string {
    if (ownerId === 0) {
      return '#000000'; // Black for 1st player
    } else {
      return '#FFFFFF'; // White for 2nd player
    }
  }

  // Custom animation function for tile drop effect
  function dropAnimation(node: Element, params: { delay?: number } = {}) {
    return {
      delay: params.delay || 0,
      duration: 400,
      easing: cubicOut,
      css: (t: number) => {
        const y = -(1 - t) * 40; // Start from above (-40px) and move to 0
        const scale = 0.9 + 0.1 * t; // More subtle scale: 90% to 100%
        const opacity = t;
        return `
          transform: translateY(${y}px) scale(${scale});
          opacity: ${opacity};
        `;
      },
    };
  }
</script>

<div class="board-container">
  <div
    class="board-viewport"
    bind:this={viewportElement}
    onmousedown={handleMouseDown}
    class:dragging={isDragging}
  >
    <div class="board-grid" style={`transform: scale(${zoom}); transform-origin: 0 0;`}>
      <!-- Render deployed tiles -->
      {#each bs.tiles as tile (tile.id)}
        <div
          class="deployed-tile"
          style={getCellStyle(tile.position.x, tile.position.y)}
          in:dropAnimation
        >
          <div
            class="tile-background"
            style="background-color: {getTileBackgroundColor(tile.ownerId)}"
          >
            <TileDeployedComponent {tile} localPlayerId={ui.localPlayerId} />
          </div>
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
    background: #3b3b3b; /* Gray board background */
  }

  .board-viewport.dragging {
    cursor: grabbing;
  }

  .board-grid {
    position: absolute;
    width: 6550px; /* 50 * 131px */
    height: 6550px; /* 50 * 131px */
    background: transparent;
  }

  .deployed-tile {
    position: absolute;
    width: 131px; /* logical cell: tile + 1px gap */
    height: 131px; /* logical cell: tile + 1px gap */
  }

  .tile-background {
    width: 130px; /* visual tile */
    height: 130px; /* visual tile */
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
    box-sizing: border-box;
  }

  .drop-position {
    position: absolute;
    width: 130px;
    height: 130px;
    outline: 1px dashed #00aa00;
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
