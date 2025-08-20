import * as esbuild from 'esbuild';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const context = await esbuild.context({
  entryPoints: ['src/server/server.ts'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  outfile: 'dist/server.js',
  external: [
    'ws',
    'fs',
    'path',
    'crypto',
    'url',
    'events',
    'stream',
    'util',
    'buffer',
    'net',
    'tls',
    'http',
    'https',
  ],
  format: 'cjs',
  sourcemap: true,
  alias: {
    '@': path.resolve(__dirname, 'src'),
  },
});

await context.watch();
console.log('Watching for changes...');
