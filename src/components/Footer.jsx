import { useState } from 'react';
import PoliciesModal   from './PoliciesModal';
import GuidelinesModal from './GuidelinesModal';
import ContactModal    from './ContactModal';
import styles from './Footer.module.css';

export default function Footer() {
  const [modal, setModal] = useState(null); // 'policies' | 'guidelines' | 'contact' | null

  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.inner}>

          {/* Brand */}
          <div className={styles.brand}>
            <img src="/Logo_-_White-removebg-preview.png" className={styles.logo} alt="Tadiosa's Gown Rental" />
            <p className={styles.tagline}>Elevating your most precious moments with the finest collection of gowns and suits since 2024.</p>
            <div className={styles.socials}>
              <a href="https://www.facebook.com/share/1DSg8i2BoY/" target="_blank" rel="noreferrer">Facebook</a>
              <a href="https://www.instagram.com/tadiosagown" target="_blank" rel="noreferrer">Instagram</a>
              <a href="https://www.tiktok.com/@tadiosasgownrental" target="_blank" rel="noreferrer">TikTok</a>
            </div>
          </div>

          {/* Collections */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>COLLECTIONS</h4>
            <ul>
              <li>Ball Gowns</li>
              <li>Suit Collection</li>
              <li>Filipiniana &amp; Barong</li>
              <li>Wedding Dress</li>
            </ul>
          </div>

          {/* Services */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>SERVICES</h4>
            <ul>
              <li><button onClick={() => setModal('contact')}>Contact Us</button></li>
              <li><button onClick={() => setModal('policies')}>Rental Terms</button></li>
              <li><button onClick={() => setModal('guidelines')}>Guidelines</button></li>
            </ul>
          </div>

          {/* Visit Us */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>VISIT US</h4>
            <p>510 Felix Reyes Street, Balibago.</p>
            <p>Open 10am – 8pm daily.</p>
            <p style={{ marginTop: 8 }}>🔥 Plus Size Available too 🤩</p>
          </div>

        </div>

        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} Tadiosa&apos;s Gown Rental. All rights reserved.</p>
        </div>
      </footer>

      {modal === 'policies'   && <PoliciesModal   onClose={() => setModal(null)} />}
      {modal === 'guidelines' && <GuidelinesModal onClose={() => setModal(null)} />}
      {modal === 'contact'    && <ContactModal    onClose={() => setModal(null)} />}
    </>
  );
}
