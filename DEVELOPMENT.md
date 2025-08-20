# Development Guide

This document covers the development environment setup, server configuration, and development workflow for the Go-TCG project.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Initial Setup

```bash
npm install
```

## 📁 Project Structure

```
go-tcg/
├── src/
│   ├── server/           # Backend server code
│   │   ├── server.ts     # Main WebSocket server
│   │   └── storage.ts    # Persistence layer
│   ├── logic/            # Game logic
│   ├── data/             # Game data and tiles
│   └── ui/               # Frontend Svelte components
├── dist/                 # Built server files
├── tsconfig.server.json  # TypeScript config for server
├── esbuild.server.js     # Production build config
└── package.json
```

## 🔧 Development Commands

### Frontend Development

```bash
npm run dev          # Start Vite dev server
npm run build        # Build frontend for production
npm run preview      # Preview production build
```

### Backend Development

```bash
npm run server:dev           # Run server once
npm run server:watch         # Development mode - auto-restart on changes
npm run server:build         # Build server for production
npm run server:start         # Run production server
```

### Tools

```bash
npm run tools:merge-cards    # Merge card data
npm run tools:convert-images # Convert images
npm run tools:all           # Run all tools
```

## 🎯 Development Workflow

### 1. Start Development Environment

**Terminal 1 - Frontend:**

```bash
npm run dev
```

**Terminal 2 - Backend:**

```bash
npm run server:watch
```

### 2. Make Changes

- Edit files in `src/logic/` - Game logic
- Edit files in `src/data/` - Game data
- Edit files in `src/server/` - Server code
- Edit files in `src/ui/` - Frontend components

### 3. Automatic Restart

The server automatically restarts when you save changes to:

- `src/logic/**/*`
- `src/data/**/*`
- `src/server/**/*`

## 🏗️ Build System

### Development Build

- **Tool:** `tsx` with TypeScript
- **Config:** `tsconfig.server.json`
- **Features:** Direct TypeScript execution, path aliases, hot reload

### Production Build

- **Tool:** `esbuild`
- **Config:** `esbuild.server.js`
- **Features:** Optimized bundle, external dependencies, source maps

## 🔌 WebSocket Server

### Features

- Real-time game state synchronization
- Action handling (playTile, etc.)
- Multi-client support
- Automatic game initialization

### Connection

- **URL:** `ws://localhost:8080`
- **Protocol:** JSON messages
- **Events:** `state`, `action`

### Message Format

```typescript
// Client to Server
{
  type: 'action',
  playerId: number,
  payload: { type: 'playTile', tile: Tile, position: Position }
}

// Server to Client
{
  type: 'state',
  state: BattleState,
  log: string[]
}
```

## 🛠️ Configuration Files

### TypeScript Configuration

- `tsconfig.json` - Base configuration
- `tsconfig.app.json` - Frontend configuration
- `tsconfig.server.json` - Server configuration with path aliases

### Build Configuration

- `esbuild.server.js` - Production server build
- `esbuild.server.watch.js` - Development watch build

## 🔍 Troubleshooting

### Common Issues

#### "WebSocketServer is not a constructor"

**Cause:** Server code being executed in browser
**Solution:** Ensure server code is not imported in frontend

#### "Cannot find package '@/data'"

**Cause:** Path alias not resolved
**Solution:** Use `tsx --tsconfig tsconfig.server.json`

#### Port 8080 already in use

**Solution:**

```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:8080 | xargs kill -9
```

#### Server not restarting on changes

**Solution:** Ensure you're using `npm run server:watch`

### Debug Mode

```bash
# Run server with debug output
npm run server:dev
```

## 📦 Dependencies

### Core Dependencies

- `ws` - WebSocket server
- `@floating-ui/dom` - UI components
- `sharp` - Image processing

### Development Dependencies

- `tsx` - TypeScript execution
- `esbuild` - Production builds
- `vite` - Frontend development
- `svelte` - Frontend framework

## 🚀 Deployment

### Production Build

```bash
# Build frontend
npm run build

# Build server
npm run server:build

# Start production server
npm run server:start
```

### Environment Variables

- No environment variables required for development
- Configure production environment as needed

### State Persistence

- **Development:** State is saved to `data/battle-state.json`
- **Production:** Configure appropriate storage solution
- **Files:** Saved state files are ignored by git

## 📝 Code Style

### TypeScript

- Use strict mode
- Prefer ES modules
- Use path aliases (`@/`)

### Svelte

- Use Svelte 5 syntax
- Prefer runes (`$state`, `$derived`, `$effect`)
- Use `onclick` instead of `on:click`

## 🔄 Version Control

### Git Hooks

- No pre-commit hooks configured
- Manual testing recommended

### Ignored Files

- `dist/` - Built files
- `node_modules/` - Dependencies
- `.svelte-kit/` - SvelteKit cache

## 📞 Support

### Getting Help

1. Check this documentation
2. Review troubleshooting section
3. Check console for error messages
4. Verify all services are running

### Logs

- Server logs appear in terminal running `npm run server:watch`
- Frontend logs appear in browser console
- Build logs appear during `npm run server:build`
