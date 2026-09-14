import styles from './GuidelinesModal.module.css';

export default function GuidelinesModal({ onClose }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose} aria-label="Close">✕</button>

        <div className={styles.header}>
          <span className={styles.eyebrow}>BEFORE YOUR VISIT</span>
          <h2 className={styles.title}>Guidelines</h2>
          <p className={styles.sub}>Everything you need to know — from your first fitting to returning your gown.</p>
        </div>

        <div className={styles.body}>
          {/* Left column */}
          <div className={styles.left}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.num}>01</span>
                <h3>Fitting Rules</h3>
              </div>
              <ul className={styles.bullets}>
                <li>The first 3 chosen gowns for fitting are <strong>FREE</strong>.</li>
                <li>An additional <strong>₱50 per gown</strong> will be charged for each extra item tried on.</li>
                <li>Good news: Fitting fees will be waived once you proceed with a reservation.</li>
              </ul>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.num}>02</span>
                <h3>Reservation &amp; Downpayment</h3>
              </div>
              <ul className={styles.bullets}>
                <li>We require a minimum downpayment of <strong>₱500</strong> to reserve.</li>
                <li>Downpayments are non-refundable if the event is canceled.</li>
                <li>You may convert it into accessories (shawl, clutch bag, glass heels) or use it to reschedule your event.</li>
              </ul>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.num}>03</span>
                <h3>Security Deposit</h3>
              </div>
              <ul className={styles.bullets}>
                <li>We collect a security deposit — it is fully refundable.</li>
                <li>The deposit is returned in full once the clothes are returned in good condition.</li>
              </ul>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.num}>04</span>
                <h3>Late Return Policy</h3>
              </div>
              <ul className={styles.bullets}>
                <li>Rental period is 3 days — counted per date, not every 24 hours.</li>
                <li>A <strong>₱200 per day</strong> charge applies for late returns.</li>
              </ul>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.num}>05</span>
                <h3>Gown Change Policy</h3>
              </div>
              <ul className={styles.bullets}>
                <li>A <strong>₱200 per day</strong> charge applies to maintain scheduling fairness for all clients.</li>
              </ul>
            </div>
          </div>

          {/* Right column — 3 Days Rent card */}
          <div className={styles.right}>
            <div className={styles.darkCard}>
              <h3 className={styles.darkTitle}>3 Days Rent</h3>
              <p className={styles.darkTagline}><em>Your Event, Our Joy</em></p>
              <p className={styles.darkNote}>Per date — not every 24 hrs = 1 day</p>

              <div className={styles.steps}>
                <div className={styles.step}>
                  <span className={styles.stepNum}>1</span>
                  <div>
                    <p className={styles.stepLabel}>1ST DAY — PICK UP</p>
                    <p>— Pick up your beautiful rented clothes</p>
                    <p>— Time: Afternoon <strong>1pm – 10pm</strong> ☀️</p>
                    <p>— Extension Fee: <strong>₱200 / day</strong></p>
                  </div>
                </div>

                <div className={styles.step}>
                  <span className={styles.stepNum}>2</span>
                  <div>
                    <p className={styles.stepLabel}>2ND DAY — YOUR EVENT</p>
                    <p>— Enjoy your event to the fullest!</p>
                    <p>— Take lots of photos 📸</p>
                    <p>— Slay the day 🔥</p>
                  </div>
                </div>

                <div className={styles.step}>
                  <span className={styles.stepNum}>3</span>
                  <div>
                    <p className={styles.stepLabel}>3RD DAY — RETURN</p>
                    <p>— Return the gown in good condition</p>
                    <p>— Receive your security deposit back</p>
                    <p>— Time: Morning <strong>8am – 3pm</strong></p>
                  </div>
                </div>
              </div>

              <div className={styles.lateFee}>
                ⚠️ Late Return Fee: <strong>₱200 per day</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
