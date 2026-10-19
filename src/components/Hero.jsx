import { useSiteImages } from '../hooks/useSiteImages';
import { imgFallback } from '../utils/imgFallback';
import styles from './Hero.module.css';

// Bundled defaults (also used as the onError fallback target).
const DEFAULT_MAIN  = '/for home and event page.jpg';
const DEFAULT_LEFT  = '/for collection4.jpg';
const DEFAULT_RIGHT = '/for collection2.jpg';

export default function Hero() {
  const { hero } = useSiteImages();

  // Shop-set images (from Manage Website) with the bundled defaults as fallback.
  const mainSrc  = hero.main  || DEFAULT_MAIN;
  const leftSrc  = hero.left  || DEFAULT_LEFT;
  const rightSrc = hero.right || DEFAULT_RIGHT;

  const handleScroll = (e) => {
    e.preventDefault();
    const target = document.querySelector('#events');
    if (!target) return;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 64, behavior: 'smooth' });
  };

  return (
    <section className={styles.hero} id="home">
      {/* Side photo strips to fill space around the main image */}
      <div className={styles.sideStrip + ' ' + styles.stripLeft}>
        <img src={leftSrc} alt="" aria-hidden="true" onError={imgFallback(DEFAULT_LEFT)} />
      </div>

      {/* Main hero image */}
      <div className={styles.mainImg}>
        <img src={mainSrc} className={styles.bg} alt="" aria-hidden="true" onError={imgFallback(DEFAULT_MAIN)} />
        <div className={styles.overlay} aria-hidden="true" />
        <div className={styles.content}>
          <img src="/Logo_-_White-removebg-preview.png" className={styles.logo} alt="Tadiosa's Gown Rental" />
          <p className={styles.tagline}>Elegance for Every Occasion</p>
          <a href="#events" className={styles.btn} onClick={handleScroll}>
            Find Your Look
          </a>
        </div>
      </div>

      {/* Right strip */}
      <div className={styles.sideStrip + ' ' + styles.stripRight}>
        <img src={rightSrc} alt="" aria-hidden="true" onError={imgFallback(DEFAULT_RIGHT)} />
      </div>
    </section>
  );
}
