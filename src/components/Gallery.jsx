import { useState } from 'react';
import { galleryImages } from '../data/items';
import Lightbox from './Lightbox';
import styles from './Gallery.module.css';

// Split into 3 rows, each card carries its ORIGINAL index for lightbox
function splitRows(images) {
  const rows = [[], [], []];
  images.forEach((src, i) => rows[i % 3].push({ src, originalIdx: i }));
  // Triple each row for seamless infinite loop
  return rows.map(row => [...row, ...row, ...row]);
}

// Card — detects landscape vs portrait on image load
function GalleryCard({ src, originalIdx, onOpen }) {
  const [isLandscape, setIsLandscape] = useState(false);

  return (
    <div
      className={`${styles.card} ${isLandscape ? styles.landscape : styles.portrait}`}
      onClick={() => onOpen(originalIdx)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onOpen(originalIdx)}
      aria-label={`Gallery photo ${originalIdx + 1}`}
    >
      <img
        src={src}
        alt={`Gallery ${originalIdx + 1}`}
        loading="lazy"
        onLoad={e => {
          const { naturalWidth, naturalHeight } = e.currentTarget;
          if (naturalWidth > naturalHeight) setIsLandscape(true);
        }}
      />
    </div>
  );
}

export default function Gallery() {
  const [lightbox, setLightbox] = useState({ open: false, index: 0 });
  const rows = splitRows(galleryImages);

  const openLb  = (idx) => setLightbox({ open: true, index: idx });
  const closeLb = () => setLightbox(lb => ({ ...lb, open: false }));
  const prevLb  = () => setLightbox(lb => ({ ...lb, index: (lb.index - 1 + galleryImages.length) % galleryImages.length }));
  const nextLb  = () => setLightbox(lb => ({ ...lb, index: (lb.index + 1) % galleryImages.length }));

  return (
    <section className={styles.section} id="gallery">
      <div className={styles.heading}>
        <span className={styles.eyebrow}>Our Work</span>
        <h2 className={styles.title}>Gallery</h2>
      </div>

      <div className={styles.carouselWrap}>
        <div className={`${styles.row} ${styles.row1}`}>
          <div className={styles.track}>
            {rows[0].map((item, idx) => (
              <GalleryCard key={`r1-${idx}`} src={item.src} originalIdx={item.originalIdx} onOpen={openLb} />
            ))}
          </div>
        </div>

        <div className={`${styles.row} ${styles.row2}`}>
          <div className={styles.track}>
            {rows[1].map((item, idx) => (
              <GalleryCard key={`r2-${idx}`} src={item.src} originalIdx={item.originalIdx} onOpen={openLb} />
            ))}
          </div>
        </div>

        <div className={`${styles.row} ${styles.row3}`}>
          <div className={styles.track}>
            {rows[2].map((item, idx) => (
              <GalleryCard key={`r3-${idx}`} src={item.src} originalIdx={item.originalIdx} onOpen={openLb} />
            ))}
          </div>
        </div>
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
