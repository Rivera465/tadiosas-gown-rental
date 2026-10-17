import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './GownDetail.module.css';
import { buildArPreviewUrl } from '../api/arPreview';
import { imgFallback, ITEM_IMAGE_PLACEHOLDER } from '../utils/imgFallback';

/** Formats a numeric peso price, or a friendly fallback when unknown. */
function formatPrice(price) {
  if (price == null || Number.isNaN(Number(price))) return 'Ask in store';
  return `₱${Number(price).toLocaleString('en-PH')}`;
}

export default function GownDetail({ item, onClose }) {
  // Freeze the page behind the modal + close on Escape. Both restored on unmount.
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  // AR is available only when the shop has uploaded a no-background overlay for
  // this item (public DTO → mapped to item.arOverlayUrl in useCatalog). The
  // hardcoded fallback items have no AR fields, so the button is hidden for them.
  const arUrl = item.arOverlayUrl
    ? buildArPreviewUrl({ overlayUrl: item.arOverlayUrl, fit: item.arFitType, name: item.name })
    : null;

  // Availability: live items carry a boolean; fallback items have none → treat
  // as available (the marketing site shouldn't scare customers off).
  const isAvailable = item.available !== false;

  function handleTryOn() {
    if (!arUrl) return;
    window.open(arUrl, '_blank', 'noopener,noreferrer');
  }

  // Render via a PORTAL into document.body. This is essential: the overlay is
  // position:fixed, but an ancestor on some pages (e.g. the Collection page's
  // .page container, which has a transform via its fadeInUp animation) would
  // otherwise become the containing block for the fixed overlay — making it
  // position relative to that tall container instead of the viewport (the "I
  // have to scroll to see the modal" bug). Portaling to <body> guarantees the
  // overlay is always centered in the actual viewport, on every page.
  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        {/* Close */}
        <button className={styles.close} onClick={onClose} aria-label="Close">✕</button>

        {/* Image */}
        <div className={styles.imgWrap}>
          <img src={item.img || ITEM_IMAGE_PLACEHOLDER} alt={item.name} onError={imgFallback(ITEM_IMAGE_PLACEHOLDER)} />
        </div>

        {/* Info */}
        <div className={styles.info}>
          <span className={styles.cat}>{item.cat}</span>
          <h2 className={styles.name}>{item.name}</h2>

          <div className={styles.divider} />

          <ul className={styles.details}>
            <li><span>Price</span><strong>{formatPrice(item.price)}</strong></li>
            <li>
              <span>Availability</span>
              <strong className={isAvailable ? styles.available : undefined}>
                {isAvailable ? 'Available' : 'Currently Unavailable'}
              </strong>
            </li>
            {item.size && <li><span>Size</span><strong>{item.size}</strong></li>}
          </ul>

          <div className={styles.divider} />

          {/* AR Try-On — only shown when the item has an overlay uploaded. */}
          {arUrl ? (
            <div className={styles.arWrap}>
              <p className={styles.arLabel}>Virtual Try-On</p>
              <p className={styles.arSub}>See how this looks on you using your camera.</p>
              <button
                className={styles.arBtn}
                onClick={handleTryOn}
                aria-label={`Try on ${item.name} using your camera`}
              >
                <span>⬡</span> Try Me
              </button>
            </div>
          ) : (
            <div className={styles.arWrap}>
              <p className={styles.arLabel}>Virtual Try-On</p>
              <p className={styles.arSub}>Not yet available for this item.</p>
            </div>
          )}

          <p className={styles.visitNote}>Visit us in-store to reserve this item.</p>
        </div>

      </div>
    </div>,
    document.body,
  );
}
