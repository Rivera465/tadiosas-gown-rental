import styles from './Hero.module.css';

export default function Hero() {
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
        <img src="/for collection4.jpg" alt="" aria-hidden="true" />
      </div>

      {/* Main hero image */}
      <div className={styles.mainImg}>
        <img src="/for home and event page.jpg" className={styles.bg} alt="" aria-hidden="true" />
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
        <img src="/for collection2.jpg" alt="" aria-hidden="true" />
      </div>
    </section>
  );
}
