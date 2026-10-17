/**
 * src/hooks/useCatalog.js
 *
 * Loads the live rental catalog from the SmartRent public API and maps each
 * item into the shape the existing UI expects ({ name, cat, img, ... }), so the
 * components (EventDresses, GownDetail) work unchanged.
 *
 * GRACEFUL FALLBACK: if the API is unreachable or returns nothing, the hook
 * falls back to the bundled hardcoded `allItems` so the site NEVER shows a blank
 * catalog (important for a marketing site + offline demos). `source` tells the
 * caller which dataset is live ('api' | 'fallback').
 *
 * DTO → UI mapping (SmartRent public DTO → Tadiosa item shape):
 *   name          ← name
 *   cat           ← category            (used by the category dropdown filter)
 *   img           ← primary_image       (first Cloudinary image, or null)
 *   id            ← id                  (internal UUID)
 *   price         ← price
 *   available     ← available
 *   arOverlayUrl  ← ar_overlay_url      (drives the "Try On AR" button)
 *   arFitType     ← ar_fit_type
 */

import { useEffect, useState } from 'react';
import { fetchPublicItems } from '../api/catalog';
import { allItems as hardcodedItems } from '../data/items';

/**
 * Maps one public DTO item to the UI item shape.
 * @param {object} dto
 * @returns {object}
 */
function mapDtoToItem(dto) {
  return {
    id:           dto.id,
    name:         dto.name,
    cat:          dto.category || 'Uncategorized',
    img:          dto.primary_image || (Array.isArray(dto.images) ? dto.images[0] : null) || null,
    images:       Array.isArray(dto.images) ? dto.images : [],
    price:        dto.price ?? null,
    available:    dto.available === true,
    arOverlayUrl: dto.ar_overlay_url || null,
    arFitType:    dto.ar_fit_type || null,
  };
}

// ---------------------------------------------------------------------------
// Module-level cache (lives OUTSIDE the React tree, so it survives component
// unmount/remount). Without this, EventDresses — which unmounts every time you
// click "Back" and remounts when you open a category — would re-fetch the whole
// catalog on every open (the "5s load again after Back" bug). We fetch ONCE,
// cache the mapped result, and reuse it instantly thereafter. An in-flight
// promise is also shared so simultaneous callers (Events + EventDresses both
// call useCatalog) trigger only a single network request.
// ---------------------------------------------------------------------------
/** @type {{ items: object[], source: 'api'|'fallback', error: string|null } | null} */
let cachedResult = null;
/** @type {Promise<{ items: object[], source: 'api'|'fallback', error: string|null }> | null} */
let inFlight = null;

/** Fetches + maps the catalog once; subsequent calls reuse the cache/promise. */
function loadCatalogOnce() {
  if (cachedResult) return Promise.resolve(cachedResult);
  if (inFlight) return inFlight;

  inFlight = (async () => {
    let result;
    try {
      const data = await fetchPublicItems({ limit: 100 });
      const list = Array.isArray(data?.items) ? data.items : [];
      result = list.length === 0
        // API reachable but empty → hardcoded so the page isn't blank.
        ? { items: hardcodedItems, source: 'fallback', error: null }
        : { items: list.map(mapDtoToItem), source: 'api', error: null };
    } catch (err) {
      // Network/API failure → graceful fallback to the bundled list.
      result = {
        items: hardcodedItems,
        source: 'fallback',
        error: err?.message || 'Failed to load the live catalog.',
      };
    }
    cachedResult = result;
    inFlight = null;
    return result;
  })();

  return inFlight;
}

/**
 * React hook: returns the live catalog. Fetches once per page load and caches
 * the result at module scope, so opening a category after clicking "Back" is
 * instant (no re-fetch, no second loading spinner).
 *
 * @returns {{ items: object[], loading: boolean, error: string|null, source: 'api'|'fallback' }}
 */
export function useCatalog() {
  // If the catalog is already cached, start with it synchronously — no loading
  // state at all on remount (this is what makes Back → reopen instant).
  const [items, setItems]     = useState(() => (cachedResult ? cachedResult.items : []));
  const [loading, setLoading] = useState(() => !cachedResult);
  const [error, setError]     = useState(() => (cachedResult ? cachedResult.error : null));
  const [source, setSource]   = useState(() => (cachedResult ? cachedResult.source : 'api'));

  useEffect(() => {
    // Already have it cached → nothing to do (no fetch, no spinner).
    if (cachedResult) return undefined;

    let cancelled = false;
    loadCatalogOnce().then((result) => {
      if (cancelled) return;
      setItems(result.items);
      setSource(result.source);
      setError(result.error);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  return { items, loading, error, source };
}

// ---------------------------------------------------------------------------
// prewarmCatalog — splash-screen preload
// ---------------------------------------------------------------------------

/** Tracks that we've already kicked off a prewarm so it runs at most once. */
let prewarmed = false;

/**
 * Preloads the catalog (and its primary thumbnails) in the BACKGROUND — meant
 * to be called while the splash screen animates, so by the time the user lands
 * on a page the data + images are already warm and there's no spinner / pop-in.
 *
 * This is best-effort and NON-BLOCKING: it never throws and never gates the
 * splash. The splash finishes on its own timer regardless of how far this got.
 *
 *   1. Trigger the single catalog fetch (populates the shared module cache that
 *      useCatalog reads — so the first component mount is instant).
 *   2. Once items resolve, prefetch each item's PRIMARY thumbnail via `Image()`
 *      so the browser caches the files. We only prefetch the primary image per
 *      item (not every image) to avoid saturating the connection.
 */
export function prewarmCatalog() {
  if (prewarmed) return;
  prewarmed = true;

  loadCatalogOnce()
    .then((result) => {
      if (typeof Image === 'undefined') return;
      for (const item of result.items) {
        const url = item?.img || (Array.isArray(item?.images) ? item.images[0] : null);
        if (url) {
          // Creating an Image and setting src kicks off a cached download.
          const pre = new Image();
          pre.decoding = 'async';
          pre.src = url;
        }
      }
    })
    .catch(() => { /* best-effort — never block the splash */ });
}
