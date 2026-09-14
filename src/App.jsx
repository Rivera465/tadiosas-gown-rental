import { useState, useCallback } from 'react';
import SplashScreen  from './components/SplashScreen';
import Navbar        from './components/Navbar';
import Hero          from './components/Hero';
import Gallery       from './components/Gallery';
import Events        from './components/Events';
import EventDresses  from './components/EventDresses';
import Footer        from './components/Footer';

export default function App() {
  const [splashDone,  setSplashDone]  = useState(false);
  const [activeEvent, setActiveEvent] = useState(null);

  const handleSplashDone  = useCallback(() => setSplashDone(true), []);
  const handleEventSelect = useCallback((key) => setActiveEvent(key), []);

  const handleBack = useCallback(() => {
    setActiveEvent(null);
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
        <Events activeEvent={activeEvent} onEventSelect={handleEventSelect} />

        {activeEvent && (
          <EventDresses eventKey={activeEvent} onBack={handleBack} />
        )}

        <Footer />
      </div>
    </>
  );
}
