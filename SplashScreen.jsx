import { useEffect, useRef, useState } from 'react';
import faceBlack from './assets/face-black.png';
import faceWhite from './assets/face-white.png';
import wordmarkWhite from './assets/wordmark-white.png';
import './SplashScreen.css';

/**
 * Tadiosa's Gown Rental — intro splash.
 *
 * Sequence: white bg + black face fades in -> smooth crossfade to
 * black bg + white face -> face glides right -> wordmark settles in.
 *
 * Call onComplete when the intro finishes so the parent can route
 * to the homepage (or just stop rendering this component).
 */
export default function SplashScreen({ onComplete }) {
  const [phase, setPhase] = useState({
    faceIn: false,
    showRing: false,
    inverted: false,
    swap: false,
    slide: false,
    wordIn: false,
  });

  const timers = useRef([]);

  useEffect(() => {
    const schedule = (patch, delay) => {
      const id = setTimeout(() => {
        setPhase((prev) => ({ ...prev, ...patch }));
      }, delay);
      timers.current.push(id);
    };

    schedule({ faceIn: true }, 150);
    schedule({ showRing: true }, 300);
    schedule({ inverted: true }, 1200);
    schedule({ swap: true }, 1500);
    schedule({ slide: true }, 2900);
    schedule({ wordIn: true }, 3750);

    const doneId = setTimeout(() => {
      onComplete && onComplete();
    }, 4700);
    timers.current.push(doneId);

    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [onComplete]);

  const stageClass = [
    'splash-stage',
    phase.inverted && 'is-inverted',
    phase.showRing && 'show-ring',
    phase.faceIn && 'face-in',
    phase.swap && 'is-swap',
    phase.slide && 'is-slide',
    phase.wordIn && 'word-in',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={stageClass}>
      <div className="splash-ring" />
      <div className="splash-mark-wrap">
        <div className="splash-face-frame is-black">
          <img src={faceBlack} alt="Tadiosa's Gown Rental mark" />
        </div>
        <div className="splash-face-frame is-white">
          <img src={faceWhite} alt="Tadiosa's Gown Rental mark" />
        </div>
        <img className="splash-wordmark" src={wordmarkWhite} alt="Tadiosa's Gown Rental" />
      </div>
    </div>
  );
}
