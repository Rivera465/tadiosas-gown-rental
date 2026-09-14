import { useCallback, useState, useEffect, useRef } from 'react';
import { allItems, eventMap } from '../data/items';
import GownDetail from './GownDetail';
import styles from './EventDresses.module.css';

export default function EventDresses({ eventKey, onBack }) {
  const config   = eventMap[eventKey];
  const filtered = allItems.filter(item => config.cats.includes(item.cat));

  const [selected, setSelected] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (sectionRef.current) {
      const offset = sectionRef.current.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  }, [eventKey]);

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.header}>
        <button className={styles.back} onClick={onBack}>
          ← Back to Events
        </button>
        <h2 className={styles.title}>Recommended for {config.label}</h2>
        <p className={styles.sub}>{config.sub}</p>
      </div>

      <div className={styles.grid}>
        {filtered.map((item, idx) => (
          <div
            key={`${item.name}-${idx}`}
            className={styles.card}
            onClick={() => setSelected(item)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && setSelected(item)}
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

      {selected && (
        <GownDetail item={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  );
}
