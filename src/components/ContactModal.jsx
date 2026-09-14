import styles from './ContactModal.module.css';

export default function ContactModal({ onClose }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose} aria-label="Close">✕</button>

        <div className={styles.header}>
          <span className={styles.eyebrow}>GET IN TOUCH</span>
          <h2 className={styles.title}>Contact Us</h2>
        </div>

        <div className={styles.body}>
          {/* Info */}
          <div className={styles.info}>
            <div className={styles.infoItem}>
              <span className={styles.infoIcon}>📍</span>
              <div>
                <p className={styles.infoLabel}>Address</p>
                <p>510 Felix Reyes Street, Balibago, Philippines</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoIcon}>🕐</span>
              <div>
                <p className={styles.infoLabel}>Hours</p>
                <p>Open Daily: ⏰ 10am – 8pm</p>
                <p>🔥 Plus Size Available too 🤩</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoIcon}>👗</span>
              <div>
                <p className={styles.infoLabel}>Collections</p>
                <p>Gown &nbsp;|&nbsp; Suit &nbsp;|&nbsp; Filipiniana &nbsp;|&nbsp; Barong &nbsp;|&nbsp; Kids</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoIcon}>📱</span>
              <div>
                <p className={styles.infoLabel}>Follow Us</p>
                <div className={styles.socials}>
                  <a href="https://www.facebook.com/share/1DSg8i2BoY/" target="_blank" rel="noreferrer" className={styles.socialLink}>
                    Facebook
                  </a>
                  <a href="https://www.instagram.com/tadiosagown" target="_blank" rel="noreferrer" className={styles.socialLink}>
                    Instagram
                  </a>
                  <a href="https://www.tiktok.com/@tadiosasgownrental" target="_blank" rel="noreferrer" className={styles.socialLink}>
                    TikTok
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className={styles.mapWrap}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3866.2558647693186!2d121.1054643!3d14.296560800000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397d9003c3285c9%3A0x159194c8e08eeb5c!2sTadiosa%E2%80%99s%20Gown%20Rental%20(Luxury%20and%20Elegant%20Gowns)!5e0!3m2!1sen!2sph!4v1786540552312!5m2!1sen!2sph"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Tadiosa's Gown Rental Location"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
