import { useState } from 'react';
import { galleryImages as fallbackGallery } from '../data/items';
import { useSiteImages } from '../hooks/useSiteImages';
import { imgFallback } from '../utils/imgFallback';
import Lightbox from './Lightbox';
import styles from './Gallery.module.css';

// A bundled image used as the last-resort fallback for any carousel photo that
// fails to load (e.g. a deleted/unreachable Cloudinary asset).
const GALLERY_FALLBACK_SRC = fallbackGallery[0];

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
        onError={imgFallback(GALLERY_FALLBACK_SRC)}
      />
    </div>
  );
}

export default function Gallery() {
  const [lightbox, setLightbox] = useState({ open: false, index: 0 });
  const [paused, setPaused] = useState(false); // play/pause the moving rows
  const { gallery: shopGallery } = useSiteImages();

  // Use the shop's uploaded carousel photos when set; otherwise the bundled set.
  const galleryImages = shopGallery.length > 0 ? shopGallery : fallbackGallery;
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

      <div className={`${styles.carouselWrap} ${paused ? styles.paused : ''}`}>
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

      {/* Pause / play the moving rows (Apple-style, bottom-right). */}
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.playPause}
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? 'Play gallery animation' : 'Pause gallery animation'}
          aria-pressed={paused}
        >
          {paused ? (
            /* Play icon */
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          ) : (
            /* Pause icon */
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          )}
        </button>
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
