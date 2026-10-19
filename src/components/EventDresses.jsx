import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCatalog } from '../hooks/useCatalog';
import { imgFallback, ITEM_IMAGE_PLACEHOLDER } from '../utils/imgFallback';
import GownDetail from './GownDetail';
import styles from './EventDresses.module.css';

/** Max items shown in the home category preview before linking to /collection. */
const PREVIEW_LIMIT = 10;

/**
 * Category-driven item grid. Shows the live catalog filtered to the chosen
 * category (case-insensitive so SmartRent's "BALL GOWN" matches a selection of
 * "Ball Gown"). Reuses the existing card grid + GownDetail (which carries the
 * AR "Try On" button). Replaces the old event-type ("Recommended for Birthday")
 * flow — the selector is now the category dropdown in the Events section.
 */
export default function EventDresses({ category, onBack }) {
  const { items, loading } = useCatalog();
  const navigate = useNavigate();

  const filtered = category
    ? items.filter(
        (item) => String(item.cat || '').toLowerCase() === String(category).toLowerCase(),
      )
    : items;

  // Home is a PREVIEW — cap at 10 so the page never grows unbounded. The rest
  // live on the dedicated /collection page.
  const previewItems = filtered.slice(0, PREVIEW_LIMIT);
  const hasMore = filtered.length > PREVIEW_LIMIT;

  function viewFullInCollection() {
    navigate(category ? `/collection?category=${encodeURIComponent(category)}` : '/collection');
  }

  const [selected, setSelected] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (sectionRef.current) {
      const offset = sectionRef.current.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  }, [category]);

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.header}>
        <button className={styles.back} onClick={onBack}>
          ← Back
        </button>
        <h2 className={styles.title}>{category ? category : 'All Items'}</h2>
        <p className={styles.sub}>
          {loading
            ? 'Loading items…'
            : `${filtered.length} item${filtered.length === 1 ? '' : 's'} available`}
        </p>
      </div>

      {!loading && filtered.length === 0 ? (
        <p className={styles.sub} style={{ textAlign: 'center' }}>
          No items in this category right now.
        </p>
      ) : (
        <>
          <div className={styles.grid}>
            {previewItems.map((item, idx) => (
              <div
                key={item.id || `${item.name}-${idx}`}
                className={styles.card}
                onClick={() => setSelected(item)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setSelected(item)}
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
            ))}
          </div>

          {/* Always offer a path into the full Collection. When the category is
              capped (>10), the label calls out the full count; otherwise it's a
              lighter "browse everything" invite. */}
          <div className={styles.viewAllWrap}>
            <button type="button" className={styles.viewAll} onClick={viewFullInCollection}>
              {hasMore
                ? `View full list in Collection (${filtered.length} items) →`
                : 'Browse the full Collection →'}
            </button>
          </div>
        </>
      )}

      {selected && (
        <GownDetail item={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  );
}
