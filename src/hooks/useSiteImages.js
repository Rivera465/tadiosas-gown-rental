/**
 * src/hooks/useSiteImages.js
 *
 * Loads the shop's editable FEATURED images from the SmartRent public API
 * (GET /public/site-images) — the hero banner (3 slots), the "What's your
 * style?" Events photos (2 slots), and the gallery carousel pool.
 *
 * GRACEFUL FALLBACK: for any slot/gallery the shop hasn't set (or if the API is
 * unreachable), the caller falls back to the bundled hardcoded images, so the
 * site always looks complete. This hook never throws.
 *
 * Shape returned by the API:
 *   { hero: { main, left, right }, events: { left, right }, gallery: [url, ...] }
 * (each hero/events slot is a URL string or null; gallery is an array of URLs)
 *
 * Cached at module scope (like useCatalog) so navigating away and back doesn't
 * refetch, and the splash preloader can warm it once.
 */

import { useEffect, useState } from 'react';

const RAW_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const API_BASE = RAW_BASE.replace(/\/+$/, '');

const EMPTY = Object.freeze({
  hero:    { main: null, left: null, right: null },
  events:  { left: null, right: null },
  gallery: [],
});

/** @type {{hero:object, events:object, gallery:string[]} | null} */
let cached = null;
/** @type {Promise<object> | null} */
let inFlight = null;

/** Fetches the public site images once; reuses the cache/promise after. */
export function loadSiteImagesOnce() {
  if (cached) return Promise.resolve(cached);
  if (inFlight) return inFlight;

  inFlight = (async () => {
    let result = EMPTY;
    try {
      const res = await fetch(`${API_BASE}/public/site-images`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        credentials: 'omit',
      });
      if (res.ok) {
        const body = await res.json();
        if (body && body.success === true && body.data) {
          const d = body.data;
          result = {
            hero:    { ...EMPTY.hero, ...(d.hero || {}) },
            events:  { ...EMPTY.events, ...(d.events || {}) },
            gallery: Array.isArray(d.gallery) ? d.gallery : [],
          };
        }
      }
    } catch {
      // Network/API failure → leave as EMPTY so callers use their fallbacks.
      result = EMPTY;
    }
    cached = result;
    inFlight = null;
    return result;
  })();

  return inFlight;
}

/**
 * React hook: returns the shop's featured images (or empty slots to fall back).
 * @returns {{ hero: object, events: object, gallery: string[], loading: boolean }}
 */
export function useSiteImages() {
  const [data, setData] = useState(() => cached || EMPTY);
  const [loading, setLoading] = useState(() => !cached);

  useEffect(() => {
    if (cached) return undefined;
    let cancelled = false;
    loadSiteImagesOnce().then((result) => {
      if (cancelled) return;
      setData(result);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  return { ...data, loading };
}
