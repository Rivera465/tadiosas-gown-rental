/**
 * src/api/arPreview.js
 *
 * Builds the "Try On AR" deep-link that opens the standalone AR Virtual Try-On
 * engine (smartrent-ar) for ONE specific item overlay. Tadiosa is just a CALLER
 * of the AR engine — it opens the engine with the item encoded in the URL:
 *
 *   <AR_APP_URL>/?overlayUrl=<png>&fit=<fit>&name=<label>
 *
 * The base URL comes from VITE_AR_APP_URL (a public, non-secret URL), defaulting
 * to the AR app's pinned dev port (5175).
 */

const DEFAULT_AR_APP_URL = 'http://localhost:5175';

/** Resolves the AR app base URL (no trailing slash). */
export function getArAppBaseUrl() {
  const raw = import.meta.env.VITE_AR_APP_URL;
  const base = (typeof raw === 'string' && raw.trim()) ? raw.trim() : DEFAULT_AR_APP_URL;
  return base.replace(/\/+$/, '');
}

/**
 * Builds the full "Try On AR" URL for an item overlay.
 * @param {Object} args
 * @param {string} args.overlayUrl - the item's AR overlay URL (http/https).
 * @param {string} [args.fit]      - ar_fit_type (upper|full|ball|lower).
 * @param {string} [args.name]     - a human label shown in the AR app.
 * @returns {string|null} the URL, or null when overlayUrl is missing/invalid.
 */
export function buildArPreviewUrl({ overlayUrl, fit, name } = {}) {
  if (typeof overlayUrl !== 'string' || !/^https?:\/\//i.test(overlayUrl)) {
    return null;
  }
  const params = new URLSearchParams();
  params.set('overlayUrl', overlayUrl);
  if (fit) params.set('fit', fit);
  if (name) params.set('name', name);
  return `${getArAppBaseUrl()}/?${params.toString()}`;
}
