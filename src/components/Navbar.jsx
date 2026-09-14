import { useState } from 'react';
import ContactModal from './ContactModal';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [menuOpen,      setMenuOpen]      = useState(false);
  const [contactOpen,   setContactOpen]   = useState(false);

  const handleNav = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    const target = document.querySelector(href);
    if (!target) return;
    const offset = target.getBoundingClientRect().top + window.scrollY - 64;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  };

  return (
    <>
      <nav className={styles.nav}>
        {/* Left links */}
        <ul className={`${styles.links} ${styles.left}`}>
          <li><a href="#home"    onClick={e => handleNav(e, '#home')}>HOME</a></li>
          <li><a href="#gallery" onClick={e => handleNav(e, '#gallery')}>GALLERY</a></li>
        </ul>

        {/* Center logo */}
        <a href="#home" className={styles.logoWrap} onClick={e => handleNav(e, '#home')}>
          <img src="/Logo_-_Black-removebg-preview.png" className={styles.logo} alt="Tadiosa's Gown Rental" />
        </a>

        {/* Right links */}
        <ul className={`${styles.links} ${styles.right}`}>
          <li><a href="#events" onClick={e => handleNav(e, '#events')}>EVENTS</a></li>
          <li>
            <button
              className={styles.enquire}
              onClick={() => setContactOpen(true)}
              aria-label="Visit Us"
            >
              VISIT US
            </button>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
    </>
  );
}
