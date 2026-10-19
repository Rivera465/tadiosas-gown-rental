import { useMemo } from 'react';
import { useCategories } from '../hooks/useCategories';
import { useCatalog } from '../hooks/useCatalog';
import { useSiteImages } from '../hooks/useSiteImages';
import { imgFallback } from '../utils/imgFallback';
import styles from './Events.module.css';

const DEFAULT_EVENTS_LEFT  = '/for collection4.jpg';
const DEFAULT_EVENTS_RIGHT = '/for collection1.jpg';

export default function Events({ activeCategory, onCategorySelect }) {
  const { categories } = useCategories();
  const { items } = useCatalog();
  const { events } = useSiteImages();

  // Shop-set Events photos (from Manage Website) with bundled defaults.
  const leftPhoto  = events.left  || DEFAULT_EVENTS_LEFT;
  const rightPhoto = events.right || DEFAULT_EVENTS_RIGHT;

  // Build the dropdown options. Prefer the live /public/categories list; if
  // that failed (empty), derive distinct category names from the loaded items
  // so the dropdown is never empty when the catalog has data.
  const categoryNames = useMemo(() => {
    if (categories.length > 0) {
      return categories.map((c) => c.name);
    }
    const seen = new Set();
    for (const it of items) {
      const c = (it.cat || '').trim();
      if (c) seen.add(c);
    }
    return Array.from(seen).sort((a, b) => a.localeCompare(b));
  }, [categories, items]);

  function handleChange(e) {
    const value = e.target.value;
    // The default/prompt option carries an empty value → treat as "no category".
    onCategorySelect(value || null);
  }

  return (
    <section id="events" className={styles.section}>
      {/* Left: logo + headline + category dropdown */}
      <div className={styles.left}>
        <img src="/Logo_-_White-removebg-preview.png" className={styles.logo} alt="Tadiosa's Gown Rental" />
        <h2 className={styles.headline}>What&apos;s your style?</h2>

        <div className={styles.browse}>
          <label htmlFor="category-select" className={styles.browseLabel}>
            Browse our Catalog
          </label>
          <div className={styles.selectWrap}>
            <select
              id="category-select"
              className={styles.select}
              value={activeCategory || ''}
              onChange={handleChange}
            >
              <option value="">Open Categories</option>
              {categoryNames.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            <span className={styles.selectChevron} aria-hidden="true">▾</span>
          </div>
        </div>
      </div>

      {/* Right: featured photos (editable via SmartRent "Manage Website"). */}
      <div className={styles.right}>
        <img src={leftPhoto} className={styles.mainPhoto} alt="Model in gown" onError={imgFallback(DEFAULT_EVENTS_LEFT)} />
        <div className={styles.photoGrid}>
          <img src={rightPhoto} alt="" aria-hidden="true" onError={imgFallback(DEFAULT_EVENTS_RIGHT)} />
        </div>
      </div>
    </section>
  );
}
