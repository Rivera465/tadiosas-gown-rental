import styles from './GownDetail.module.css';

export default function GownDetail({ item, onClose }) {
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
            <li><span>Price</span><strong>₱1,000</strong></li>
            <li><span>Availability</span><strong className={styles.available}>Available</strong></li>
            <li><span>Size</span><strong>XS – L</strong></li>
          </ul>

          <div className={styles.divider} />

          {/* AR Try-On Placeholder */}
          <div className={styles.arWrap}>
            <p className={styles.arLabel}>Virtual Try-On</p>
            <p className={styles.arSub}>See how this gown looks on you using your camera.</p>
            <button
              className={styles.arBtn}
              onClick={() => { /* TODO: launch AR try-on for item.img */ }}
              aria-label="Try on in AR"
            >
              <span>⬡</span> Try On AR
              <span className={styles.arBadge}>Coming Soon</span>
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
