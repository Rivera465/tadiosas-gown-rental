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
    <section className={styles.section} id="events">
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
  );
}
