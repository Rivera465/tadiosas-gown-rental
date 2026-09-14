import { useEffect, useRef } from 'react';
import styles from './SplashScreen.module.css';

export default function SplashScreen({ onDone }) {
  const stageRef = useRef(null);
  const timers   = useRef([]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const t = (fn, ms) => {
      const id = setTimeout(fn, ms);
      timers.current.push(id);
    };

    // Reset classes
    stage.className = styles.stage;

    // Sequence mirroring the original HTML animation
    t(() => stage.classList.add(styles.faceIn),   150);   // black face fades in, white bg
    t(() => stage.classList.add(styles.showRing),  300);
    t(() => stage.classList.add(styles.inverted), 1200);  // bg turns black
    t(() => stage.classList.add(styles.swap),     1500);  // faces crossfade black -> white
    t(() => stage.classList.add(styles.slide),    2900);  // glides right
    t(() => stage.classList.add(styles.wordIn),   3750);  // wordmark appears
    t(() => {
      stage.classList.add(styles.fadeOut);
      setTimeout(onDone, 700);
    }, 4700);

    return () => timers.current.forEach(clearTimeout);
  }, [onDone]);

  return (
    <div ref={stageRef} className={styles.stage}>
      {/* Decorative ring */}
      <div className={styles.ring} />

      <div className={styles.markWrap}>
        {/* Black logo icon (shown on white bg) */}
        <div className={`${styles.faceFrame} ${styles.black}`}>
          <img src="/face-black.png" alt="Tadiosa's Gown Rental" />
        </div>

        {/* White logo icon (shown on black bg) */}
        <div className={`${styles.faceFrame} ${styles.white}`}>
          <img src="/face-white.png" alt="Tadiosa's Gown Rental" />
        </div>

        {/* Wordmark — slides in from left after icon slides right */}
        <img
          src="/wordmark-white.png"
          className={styles.wordmark}
          alt="Tadiosa's Gown Rental wordmark"
        />
      </div>
    </div>
  );
}
