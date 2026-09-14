import styles from './PoliciesModal.module.css';

export default function PoliciesModal({ onClose }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose} aria-label="Close">✕</button>

        <div className={styles.header}>
          <span className={styles.eyebrow}>TERMS &amp; CONDITIONS</span>
          <h2 className={styles.title}>Our Policies</h2>
        </div>

        <div className={styles.grid}>
          {/* Rental Policy */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.icon}>📄</span>
              <h3>Rental Policy</h3>
            </div>
            <hr className={styles.divider} />
            <ol className={styles.list}>
              <li>The balance must be fully paid upon pick-up of the item.</li>
              <li>
                Rental is strictly <strong>3 days</strong> — counted per date, not per 24 hours.
                <blockquote className={styles.quote}>
                  1st day — Pick up &nbsp;|&nbsp; 2nd day — Event &nbsp;|&nbsp; 3rd day — Return
                </blockquote>
                <ul className={styles.sub}>
                  <li>A penalty of <strong>₱200 per day</strong> for each day exceeding the rental period.</li>
                  <li>Security deposit is returned once the gown is returned undamaged.</li>
                </ul>
              </li>
              <li><strong>Strictly no alteration.</strong></li>
              <li>There is a <strong>₱150 charge</strong> for broken or changed hangers.</li>
            </ol>
          </div>

          {/* Cancellation Policy */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.icon}>⊗</span>
              <h3>Cancellation Policy</h3>
            </div>
            <hr className={styles.divider} />
            <ol className={styles.list}>
              <li>Rescheduling is free, but subject to gown availability on the new date.</li>
              <li>
                <strong>Strictly no refunds.</strong> Down payment (max <strong>₱500</strong>) is non-refundable.
                <ul className={styles.sub}>
                  <li>The down payment may be used to rebook or converted towards shawls, bags, or heels.</li>
                </ul>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
