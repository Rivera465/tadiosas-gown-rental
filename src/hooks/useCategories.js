/**
 * src/hooks/useCategories.js
 *
 * Loads the live, active rental categories from the SmartRent public API
 * (GET /public/categories). These are the SAME categories the shop manages in
 * SmartRent, so the website's "Browse our Categories" dropdown stays perfectly
 * in sync — a category added/renamed/removed in SmartRent reflects here with no
 * code change.
 *
 * GRACEFUL: on any network/API failure it returns an empty list (and an error
 * string) so the caller can fall back to deriving categories from the items it
 * already loaded via useCatalog — the dropdown is never empty when items exist.
 *
 * Shape returned by the API per category: { name: string, item_count: number }.
 */

import { useEffect, useState } from 'react';
import { fetchPublicCategories } from '../api/catalog';

/**
 * React hook: fetches the active public categories once on mount.
 *
 * @returns {{ categories: Array<{name: string, item_count: number}>, loading: boolean, error: string|null }}
 */
export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await fetchPublicCategories();
        if (cancelled) return;
        setCategories(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        if (cancelled) return;
        // Non-fatal — caller derives categories from loaded items instead.
        setCategories([]);
        setError(err?.message || 'Failed to load categories.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { categories, loading, error };
}
