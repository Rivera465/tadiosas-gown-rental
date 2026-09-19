import { useState, useCallback } from 'react';
import { galleryImages } from '../data/items';
import Lightbox from './Lightbox';
import styles from './Gallery.module.css';

export default function Gallery() {
  const [lightbox, setLightbox] = useState({ open: false, index: 0 });

  const openLb = useCallback((idx) => setLightbox({ open: true, index: idx }), []);
  const closeLb = useCallback(() => setLightbox(lb => ({ ...lb, open: false })), []);
  const prevLb  = useCallback(() =>
    setLightbox(lb => ({ ...lb, index: (lb.index - 1 + galleryImages.length) % galleryImages.length }))
  , []);
  const nextLb  = useCallback(() =>
    setLightbox(lb => ({ ...lb, index: (lb.index + 1) % galleryImages.length }))
  , []);

  return (
    <section className={styles.section} id="gallery">
      <div className={styles.heading}>
        <span className={styles.eyebrow}>Our Work</span>
        <h2 className={styles.title}>Gallery</h2>
      </div>
      <div className={styles.grid}>
        {galleryImages.map((src, idx) => (
          <div
            key={idx}
            className={styles.cell}
            onClick={() => openLb(idx)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && openLb(idx)}
            aria-label={`Gallery photo ${idx + 1}`}
          >
            <img src={src} alt={`Gallery photo ${idx + 1}`} loading="lazy" />
          </div>
        ))}
      </div>

      {lightbox.open && (
        <Lightbox
          images={galleryImages}
          index={lightbox.index}
          onClose={closeLb}
          onPrev={prevLb}
          onNext={nextLb}
        />
      )}
    </section>
  );
}
