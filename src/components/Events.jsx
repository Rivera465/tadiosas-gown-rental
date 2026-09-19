import styles from './Events.module.css';

const eventTypes = [
  { key: 'birthday', label: 'Birthday' },
  { key: 'wedding',  label: 'Wedding Guest' },
  { key: 'ball',     label: 'Ball / Party' },
  { key: 'special',  label: 'Special Occasion' },
  { key: 'school',   label: 'School Event' },
];

export default function Events({ activeEvent, onEventSelect }) {
  return (
    <>
      {/* Events section title block — reduced top spacing */}
      <div id="events" style={{
        background: '#0a0a0a',
        padding: '44px 60px 0 60px',
        textAlign: 'left',
      }}>
        <span style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '12px',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.4)',
          display: 'block',
          marginBottom: '8px',
          fontWeight: '600',
        }}>
          Find Your Style
        </span>
        <h2 style={{
          fontFamily: "'The Seasons', Georgia, serif",
          fontSize: '48px',
          fontWeight: '600',
          color: '#ffffff',
          marginBottom: '0',
        }}>
          Events
        </h2>
      </div>

      <section className={styles.section}>
        {/* Left: logo + headline + event buttons */}
        <div className={styles.left}>
          <img src="/Logo_-_White-removebg-preview.png" className={styles.logo} alt="Tadiosa's Gown Rental" />
          <h2 className={styles.headline}>What's your event coming up?</h2>
          <div className={styles.buttons}>
            {eventTypes.map(evt => (
              <button
                key={evt.key}
                className={`${styles.btn} ${activeEvent === evt.key ? styles.active : ''}`}
                onClick={() => onEventSelect(evt.key)}
              >
                {evt.label.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Right: main photo + 1 collection photo */}
        <div className={styles.right}>
          <img src="/for collection4.jpg" className={styles.mainPhoto} alt="Model in gown" />
          <div className={styles.photoGrid}>
            <img src="/for collection1.jpg" alt="" aria-hidden="true" />
          </div>
        </div>
      </section>
    </>
  );
}
