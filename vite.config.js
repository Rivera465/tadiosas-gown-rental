import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Vite config for the Tadiosa customer website.
 *
 * Dev server is PINNED to port 5174 (strictPort) so that, when every SmartRent
 * repo runs at once, each frontend keeps its own lane:
 *   - smartrent-admin-client → 5173
 *   - tadiosa website (this)  → 5174
 *   - smartrent-ar            → 5175
 *   - smartrent-admin-api     → 5000
 * The SmartRent public API's dev CORS allowlist already permits localhost:5174.
 * strictPort makes Vite FAIL LOUDLY if 5174 is taken rather than drifting.
 */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: true,
  },
  preview: {
    port: 5174,
    strictPort: true,
  },
});
