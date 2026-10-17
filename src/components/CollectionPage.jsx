import { useMemo, useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCatalog } from '../hooks/useCatalog';
import { imgFallback, ITEM_IMAGE_PLACEHOLDER } from '../utils/imgFallback';
import GownDetail from './GownDetail';
import styles from './CollectionPage.module.css';

const PAGE_SIZE = 20; // single-category view: 4 rows × 5 per row

/**
 * CollectionPage — the dedicated full catalog at /collection.
 *
 * TWO BROWSE MODES:
 *   • "All"  → one HORIZONTAL SHELF per category (Netflix/Shopee style): a
 *     heading + a row of cards you scroll sideways (‹ › arrows on desktop,
 *     native swipe on touch). Keeps the category distinction while staying
 *     compact vertically.
 *   • A single category (chip) → the full VERTICAL grid for that category,
 *     5-per-row, paginated.
 *
 * Reuses the shared GownDetail modal. Reads ?category=<name> so the home page's
 * "View full list in Collection" link can deep-link straight to a category.
 */

// ---------------------------------------------------------------------------
// ItemCard — shared card markup for both the shelves and the grid.
// ---------------------------------------------------------------------------
function ItemCard({ item, onOpen }) {
  return (
    <div
      className={styles.card}
      onClick={() => onOpen(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onOpen(item)}
      aria-label={`View ${item.name}`}
    >
      <div className={styles.imgWrap}>
        <img src={item.img || ITEM_IMAGE_PLACEHOLDER} alt={item.name} loading="lazy" onError={imgFallback(ITEM_IMAGE_PLACEHOLDER)} />
      </div>
      <div className={styles.info}>
        <h3>{item.name}</h3>
        <p>{item.cat}</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CategoryShelf — one horizontal, side-scrolling row for a category ("All").
// ---------------------------------------------------------------------------
function CategoryShelf({ name, items, onOpen }) {
  const trackRef = useRef(null);
  // Whether there's more to scroll in each direction (drives arrow disabling).
  const [canLeft, setCanLeft]   = useState(false);
  const [canRight, setCanRight] = useState(false);

  // Recompute scroll affordances from the track's current position/size.
  function updateArrows() {
    const el = trackRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    // 1px tolerance for sub-pixel rounding at the extremes.
    setCanLeft(el.scrollLeft > 1);
    setCanRight(el.scrollLeft < maxScroll - 1);
  }

  // Wire up scroll + resize listeners; run once on mount (and when items change).
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return undefined;
    updateArrows();
    el.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    return () => {
      el.removeEventListener('scroll', updateArrows);
      window.removeEventListener('resize', updateArrows);
    };
  }, [items]);

  // Advance the row by one FULL page of 5 cards per click (next/prev set of 5),
  // not a per-item nudge. One visible width == exactly 5 cards + their gaps.
  function scrollByPage(dir) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth * dir, behavior: 'smooth' });
  }

  return (
    <section className={styles.shelf}>
      <div className={styles.shelfHead}>
        <h2 className={styles.groupTitle}>{name}</h2>
        {/* ‹ › arrows — desktop affordance for horizontal scroll; hidden on
            touch where users simply swipe (see CSS). */}
        <div className={styles.shelfArrows}>
          <button
            type="button"
            className={styles.arrowBtn}
            onClick={() => scrollByPage(-1)}
            disabled={!canLeft}
            aria-label={`Previous ${name} items`}
          >
            ‹
          </button>
          <button
            type="button"
            className={styles.arrowBtn}
            onClick={() => scrollByPage(1)}
            disabled={!canRight}
            aria-label={`Next ${name} items`}
          >
            ›
          </button>
        </div>
      </div>

      <div className={styles.shelfTrack} ref={trackRef}>
        {items.map((item, idx) => (
          <div key={item.id || `${item.name}-${idx}`} className={styles.shelfCard}>
            <ItemCard item={item} onOpen={onOpen} />
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// CollectionPage
// ---------------------------------------------------------------------------
export default function CollectionPage() {
  const { items, loading, source } = useCatalog();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialCategory = searchParams.get('category') || 'all';
  const [activeCat, setActiveCat] = useState(initialCategory);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');

  const isAll = activeCat === 'all';
  const query = search.trim().toLowerCase();
  const isSearching = query.length > 0;

  // Distinct category names present in the catalog (for the filter chips).
  const categories = useMemo(() => {
    const seen = new Set();
    for (const it of items) {
      const c = (it.cat || '').trim();
      if (c) seen.add(c);
    }
    return Array.from(seen).sort((a, b) => a.localeCompare(b));
  }, [items]);

  // "All" → group every item by category (one shelf each).
  const shelves = useMemo(() => {
    if (!isAll) return [];
    const map = new Map();
    for (const it of items) {
      const key = it.cat || 'Uncategorized';
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(it);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [items, isAll]);

  // Single category → the flat list for that category (paginated below).
  const categoryItems = useMemo(() => {
    if (isAll) return [];
    return items.filter(
      (it) => String(it.cat || '').toLowerCase() === activeCat.toLowerCase(),
    );
  }, [items, activeCat, isAll]);

  const totalPages = Math.max(1, Math.ceil(categoryItems.length / PAGE_SIZE));
  const pageItems = categoryItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Search results — flat list matching the query on item name OR category.
  // Respects the active category chip (search within that category when one is
  // selected; search everything when "All"). Shown as a flat grid, not shelves.
  const searchResults = useMemo(() => {
    if (!isSearching) return [];
    const base = isAll
      ? items
      : items.filter((it) => String(it.cat || '').toLowerCase() === activeCat.toLowerCase());
    return base.filter((it) => {
      const name = String(it.name || '').toLowerCase();
      const cat = String(it.cat || '').toLowerCase();
      return name.includes(query) || cat.includes(query);
    });
  }, [items, isSearching, isAll, activeCat, query]);

  // Keep the URL's ?category= in sync and reset to page 1 on filter change.
  function selectCategory(cat) {
    setActiveCat(cat);
    setPage(1);
    if (cat === 'all') setSearchParams({});
    else setSearchParams({ category: cat });
  }

  // Scroll handling:
  //  • On INITIAL navigation to /collection → jump to the top INSTANTLY so the
  //    page simply starts at the top (the browser otherwise carries over the
  //    home page's scroll position, and a smooth scroll would animate up from
  //    there — the "starts at the bottom then scrolls up on its own" bug).
  //  • On subsequent PAGE changes (pagination) → smooth scroll to the top.
  const didMountRef = useRef(false);
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      window.scrollTo({ top: 0, behavior: 'auto' }); // instant on first render
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' }); // animated on page change
    }
  }, [page]);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <button className={styles.back} onClick={() => navigate('/')}>
          ← Back to Home
        </button>
        <div className={styles.titleBlock}>
          <span className={styles.eyebrow}>Browse Everything</span>
          <h1 className={styles.title}>Collection</h1>
          <p className={styles.sub}>
            {loading ? 'Loading the collection…' : `${items.length} items across ${categories.length} categories`}
          </p>
        </div>
      </header>

      {/* Search */}
      {!loading && items.length > 0 && (
        <div className={styles.searchWrap}>
          <input
            type="search"
            className={styles.search}
            placeholder="Search items by name or category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search the collection"
          />
        </div>
      )}

      {/* Category filter chips — single horizontal row, scrolls when many.
          Hidden while searching (results are a flat cross-category grid). */}
      {!loading && !isSearching && categories.length > 0 && (
        <div className={styles.filters} role="tablist" aria-label="Filter by category">
          <div className={styles.filtersInner}>
            <button
              type="button"
              role="tab"
              aria-selected={isAll}
              className={`${styles.chip} ${isAll ? styles.chipActive : ''}`}
              onClick={() => selectCategory('all')}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={activeCat.toLowerCase() === cat.toLowerCase()}
                className={`${styles.chip} ${activeCat.toLowerCase() === cat.toLowerCase() ? styles.chipActive : ''}`}
                onClick={() => selectCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && items.length === 0 ? (
        <p className={styles.status}>Loading items…</p>
      ) : items.length === 0 ? (
        <p className={styles.status}>No items to show.</p>
      ) : isSearching ? (
        /* ── Search active → flat results grid (no shelves/chips) ── */
        <section className={styles.group}>
          <p className={styles.resultCount}>
            {searchResults.length === 0
              ? `No items match “${search.trim()}”.`
              : `${searchResults.length} result${searchResults.length === 1 ? '' : 's'} for “${search.trim()}”`}
          </p>
          {searchResults.length > 0 && (
            <div className={styles.grid}>
              {searchResults.map((item, idx) => (
                <ItemCard key={item.id || `${item.name}-${idx}`} item={item} onOpen={setSelected} />
              ))}
            </div>
          )}
        </section>
      ) : isAll ? (
        /* ── "All" → one horizontal shelf per category ── */
        shelves.map(([catName, catItems]) => (
          <CategoryShelf key={catName} name={catName} items={catItems} onOpen={setSelected} />
        ))
      ) : (
        /* ── Single category → vertical grid + pagination ── */
        <>
          <section className={styles.group}>
            <div className={styles.grid}>
              {pageItems.map((item, idx) => (
                <ItemCard key={item.id || `${item.name}-${idx}`} item={item} onOpen={setSelected} />
              ))}
            </div>
          </section>

          {totalPages > 1 && (
            <nav className={styles.pagination} aria-label="Collection pages">
              <button
                className={styles.pageBtn}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                ← Prev
              </button>
              <span className={styles.pageInfo}>Page {page} of {totalPages}</span>
              <button
                className={styles.pageBtn}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Next →
              </button>
            </nav>
          )}
        </>
      )}

      {source === 'fallback' && !loading && (
        <p className={styles.offlineNote}>
          Showing a sample collection — live catalog is temporarily unavailable.
        </p>
      )}

      {selected && <GownDetail item={selected} onClose={() => setSelected(null)} />}
    </main>
  );
}
