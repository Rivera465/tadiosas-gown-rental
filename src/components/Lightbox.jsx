import { useEffect, useCallback } from 'react';
import styles from './Lightbox.module.css';

export default function Lightbox({ images, index, onClose, onPrev, onNext }) {
  const handleKey = useCallback((e) => {
    if (e.key === 'Escape')     onClose();
    if (e.key === 'ArrowLeft')  onPrev();
    if (e.key === 'ArrowRight') onNext();
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [handleKey]);

  return (
    <div className={styles.backdrop} onClick={onClose} role="dialog" aria-modal="true" aria-label="Image lightbox">
      <button className={styles.close} onClick={onClose} aria-label="Close">✕</button>

      <button
        className={`${styles.arrow} ${styles.prev}`}
        onClick={e => { e.stopPropagation(); onPrev(); }}
        aria-label="Previous image"
      >
        &#8592;
      </button>

      <img
        src={images[index]}
        className={styles.img}
        alt={`Gallery item ${index + 1}`}
        onClick={e => e.stopPropagation()}
      />

      <button
        className={`${styles.arrow} ${styles.next}`}
        onClick={e => { e.stopPropagation(); onNext(); }}
        aria-label="Next image"
      >
        &#8594;
      </button>

      <p className={styles.counter}>{index + 1} / {images.length}</p>

      {/* AR TRY-ON PLACEHOLDER — replace onClick with real AR logic */}
      <button
        className={styles.arBtn}
        onClick={e => { e.stopPropagation(); /* TODO: launch AR try-on */ }}
        aria-label="Try on in AR"
        title="AR Try-On coming soon"
      >
        ⬡&nbsp; Try On AR
      </button>
    </div>
  );
}
