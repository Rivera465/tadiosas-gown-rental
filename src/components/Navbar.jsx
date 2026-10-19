import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ContactModal from './ContactModal';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Smooth-scroll to an in-page section. If we're NOT on the home route (e.g.
  // on /collection), first navigate home, then scroll once it has rendered.
  const scrollToSection = (href) => {
    const doScroll = () => {
      const target = document.querySelector(href);
      if (!target) return;
      const offset = target.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    };
    if (location.pathname !== '/') {
      navigate('/');
      // Wait a tick for the home page to mount before scrolling.
      setTimeout(doScroll, 80);
    } else {
      doScroll();
    }
  };

  const handleNav = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    scrollToSection(href);
  };

  const goToCollection = (e) => {
    e.preventDefault();
    setMenuOpen(false);
    navigate('/collection');
  };

  return (
    <>
      <nav className={styles.nav}>
        {/* Logo — left */}
        <a href="#home" className={styles.logoWrap} onClick={e => handleNav(e, '#home')}>
          <img src="/Logo_-_Black-removebg-preview.png" className={styles.logo} alt="Tadiosa's Gown Rental" />
        </a>

        {/* All nav links grouped on the right */}
        <ul className={`${styles.links} ${styles.right}`}>
          <li><a href="#home"    onClick={e => handleNav(e, '#home')}>HOME</a></li>
          <li><a href="#gallery" onClick={e => handleNav(e, '#gallery')}>GALLERY</a></li>
          <li><a href="#events"  onClick={e => handleNav(e, '#events')}>STYLES</a></li>
          <li><a href="/collection" onClick={goToCollection}>COLLECTION</a></li>
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

      {/* Mobile full-screen menu */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.open : ''}`}>
        <a href="#home"    onClick={e => handleNav(e, '#home')}>Home</a>
        <a href="#gallery" onClick={e => handleNav(e, '#gallery')}>Gallery</a>
        <a href="#events"  onClick={e => handleNav(e, '#events')}>Styles</a>
        <a href="/collection" onClick={goToCollection}>Collection</a>
        <button
          className={styles.mobileVisitBtn}
          onClick={() => { setMenuOpen(false); setContactOpen(true); }}
        >
          Visit Us
        </button>
      </div>

      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
    </>
  );
}
