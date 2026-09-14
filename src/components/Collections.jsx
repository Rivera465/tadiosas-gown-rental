import { useState, useCallback } from 'react';
import { collectionItems, categories } from '../data/items';
import Lightbox from './Lightbox';
import styles from './Collections.module.css';

export default function Collections() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightbox, setLightbox]         = useState({ open: false, index: 0 });

  const filtered = activeFilter === 'all'
    ? collectionItems
    : collectionItems.filter(i => i.cat === activeFilter);

  const openLb  = useCallback((idx) => setLightbox({ open: true, index: idx }), []);
  const closeLb = useCallback(() => setLightbox(lb => ({ ...lb, open: false })), []);
  const prevLb  = useCallback(() =>
    setLightbox(lb => ({ ...lb, index: (lb.index - 1 + filtered.length) % filtered.length }))
  , [filtered.length]);
  const nextLb  = useCallback(() =>
    setLightbox(lb => ({ ...lb, index: (lb.index + 1) % filtered.length }))
  , [filtered.length]);

  return (
    <section className={styles.section} id="collections">
      <h2 className={styles.title}>Our Collections</h2>

      <div className={styles.tabs} role="tablist">
        {categories.map(cat => (
          <button
            key={cat}
            role="tab"
            aria-selected={activeFilter === cat}
            className={`${styles.tab} ${activeFilter === cat ? styles.active : ''}`}
            onClick={() => setActiveFilter(cat)}
          >
            {cat === 'all' ? 'All' : cat}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {filtered.map((item, idx) => (
          <div
            key={`${item.name}-${idx}`}
            className={styles.card}
            onClick={() => openLb(idx)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && openLb(idx)}
            aria-label={`View ${item.name}`}
          >
            <div className={styles.imgWrap}>
              <img src={item.img} alt={item.name} loading="lazy" />
            </div>
            <div className={styles.info}>
              <h3>{item.name}</h3>
              <p>{item.cat}</p>
            </div>
          </div>
        ))}
      </div>

      {lightbox.open && (
        <Lightbox
          images={filtered.map(i => i.img)}
          index={lightbox.index}
          onClose={closeLb}
          onPrev={prevLb}
          onNext={nextLb}
        />
      )}
    </section>
  );
}
