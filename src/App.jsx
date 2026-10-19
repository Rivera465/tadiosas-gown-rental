import { useState, useCallback } from 'react';
import SplashScreen  from './components/SplashScreen';
import Navbar        from './components/Navbar';
import Hero          from './components/Hero';
import Gallery       from './components/Gallery';
import Events        from './components/Events';
import EventDresses  from './components/EventDresses';
import Footer        from './components/Footer';

/**
 * Session flag so the splash screen plays only ONCE per browser session (like
 * Facebook's intro). Navigating to /collection and back unmounts/remounts App,
 * which would otherwise replay the splash every time. sessionStorage survives
 * in-app navigation but resets on a new tab / hard refresh — which is the
 * desired "fresh visit shows splash" behaviour.
 */
const SPLASH_SEEN_KEY = 'tadiosa_splash_seen_v1';

export default function App() {
  // Start already-done if the splash has played this session → no replay on
  // return from another route.
  const [splashDone, setSplashDone] = useState(
    () => typeof sessionStorage !== 'undefined' && sessionStorage.getItem(SPLASH_SEEN_KEY) === '1',
  );
  const [activeCategory, setActiveCategory] = useState(null);

  const handleSplashDone = useCallback(() => {
    try { sessionStorage.setItem(SPLASH_SEEN_KEY, '1'); } catch { /* ignore */ }
    setSplashDone(true);
  }, []);
  const handleCategorySelect = useCallback((name) => setActiveCategory(name), []);

  const handleBack = useCallback(() => {
    setActiveCategory(null);
    setTimeout(() => {
      const el = document.querySelector('#events');
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 64, behavior: 'smooth' });
    }, 50);
  }, []);

  return (
    <>
      {!splashDone && <SplashScreen onDone={handleSplashDone} />}

      <div style={{ visibility: splashDone ? 'visible' : 'hidden' }}>
        <Navbar />
        <Hero />
        <Gallery />
        <Events activeCategory={activeCategory} onCategorySelect={handleCategorySelect} />

        {activeCategory && (
          <EventDresses category={activeCategory} onBack={handleBack} />
        )}

        <Footer />
      </div>
    </>
  );
}
