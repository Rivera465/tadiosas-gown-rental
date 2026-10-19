/**
 * src/api/catalog.js
 *
 * Thin client for the SmartRent PUBLIC catalog API — the read-only, un-authenticated
 * endpoints the shop exposes for this customer website:
 *
 *   GET <VITE_API_URL>/public/items       — live item list (price, images, availability, AR)
 *   GET <VITE_API_URL>/public/items/:id   — single item detail
 *   GET <VITE_API_URL>/public/categories  — active categories
 *
 * No auth, no cookies — plain fetch(). The base URL comes from VITE_API_URL
 * (a public, non-secret value). All functions throw on network/HTTP failure so
 * the caller (useCatalog) can fall back to the bundled hardcoded list.
 */

const RAW_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
/** Base URL with any trailing slash stripped. */
const API_BASE = RAW_BASE.replace(/\/+$/, '');

/**
 * Performs a GET against the public API and returns the unwrapped `data`.
 * @param {string} path - e.g. '/public/items'
 * @param {Record<string, string|number>} [params]
 * @returns {Promise<any>} the `data` field of the success envelope
 * @throws {Error} on network failure, non-2xx, or an error envelope
 */
async function getJson(path, params = {}) {
  const url = new URL(`${API_BASE}${path}`);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v).length > 0) {
      url.searchParams.set(k, String(v));
    }
  });

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: { Accept: 'application/json' },
    // Public catalog is non-credentialed — do NOT send cookies.
    credentials: 'omit',
  });

  if (!res.ok) {
    throw new Error(`Catalog API ${path} failed: HTTP ${res.status}`);
  }

  const body = await res.json();
  if (!body || body.success !== true) {
    const msg = body?.error?.message || 'Catalog API returned an error.';
    throw new Error(msg);
  }
  return body.data;
}

/**
 * Fetches a page of public catalog items.
 *
 * @param {Object} [opts]
 * @param {string} [opts.category] - filter by category name
 * @param {string} [opts.search]   - search by code or name
 * @param {number} [opts.page=1]
 * @param {number} [opts.limit=100] - default high so the site shows everything
 * @returns {Promise<{ items: object[], total: number, page: number, limit: number, totalPages: number }>}
 */
export function fetchPublicItems({ category, search, page = 1, limit = 100 } = {}) {
  return getJson('/public/items', { category, search, page, limit });
}

/**
 * Fetches a single public item's detail by its internal id.
 * @param {string} id
 * @returns {Promise<object>} public item DTO
 */
export function fetchPublicItemById(id) {
  return getJson(`/public/items/${encodeURIComponent(id)}`);
}

/**
 * Fetches the active public categories (name + item_count).
 * @returns {Promise<Array<{ name: string, item_count: number }>>}
 */
export function fetchPublicCategories() {
  return getJson('/public/categories');
}
