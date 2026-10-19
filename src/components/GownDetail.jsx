import styles from './GownDetail.module.css';

const AR_APP_URL = import.meta.env.VITE_AR_APP_URL || 'https://smartrent-ar-itelect.vercel.app';

// Map tadiosa category names to AR fit types
const FIT_TYPE_MAP = {
  'Gown':           'full',
  'Ball Gown':      'ball',
  'Dress':          'full',
  'Barong':         'upper',
  'Bolero':         'upper',
  'Alampay':        'upper',
  'Premium Tuxedo': 'upper',
};

export default function GownDetail({ item, onClose }) {
  const handleArTryOn = () => {
    const fit  = FIT_TYPE_MAP[item.cat] || 'full';
    const name = encodeURIComponent(item.name);

    // Build the absolute overlay URL from the item's image path
    const overlayUrl = item.img.startsWith('http')
      ? item.img
      : `${window.location.origin}${item.img}`;

    const arUrl = `${AR_APP_URL}?overlayUrl=${encodeURIComponent(overlayUrl)}&fit=${fit}&name=${name}`;
    window.open(arUrl, '_blank', 'noopener,noreferrer');
  };
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        {/* Close */}
        <button className={styles.close} onClick={onClose} aria-label="Close">✕</button>

        {/* Image */}
        <div className={styles.imgWrap}>
          <img src={item.img} alt={item.name} />
        </div>

        {/* Info */}
        <div className={styles.info}>
          <span className={styles.cat}>{item.cat}</span>
          <h2 className={styles.name}>{item.name}</h2>

          <div className={styles.divider} />

          <ul className={styles.details}>
            <li><span>Rental Period</span><strong>3 Days</strong></li>
            <li><span>Pick Up</span><strong>1pm – 10pm</strong></li>
            <li><span>Return</span><strong>8am – 3pm</strong></li>
            <li><span>Late Fee</span><strong>₱200 / day</strong></li>
            <li><span>Down Payment</span><strong>₱500 min.</strong></li>
          </ul>

          <div className={styles.divider} />

          {/* AR Try-On */}
          <div className={styles.arWrap}>
            <p className={styles.arLabel}>Virtual Try-On</p>
            <p className={styles.arSub}>See how this gown looks on you using your camera.</p>
            <button
              className={styles.arBtn}
              onClick={handleArTryOn}
              aria-label="Try on in AR"
            >
              <span>⬡</span> Try On AR
            </button>
          </div>

          <button className={styles.visitBtn} onClick={onClose}>
            Visit Us to Reserve
          </button>
        </div>

      </div>
    </div>
  );
}
