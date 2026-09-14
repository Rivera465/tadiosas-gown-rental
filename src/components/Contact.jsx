import styles from './Contact.module.css';

export default function Contact() {
  return (
    <section className={styles.section} id="contact">
      <div className={styles.inner}>
        <img src="/Logo_-_Black-removebg-preview.png" className={styles.logo} alt="Tadiosa's Gown Rental" />
        <h2 className={styles.heading}>Get in Touch</h2>
        <p className={styles.sub}>
          Ready to look stunning? Reach out to us and let&apos;s find the perfect gown for you.
        </p>
        <ul className={styles.details}>
          <li>📍 Philippines</li>
          <li>📞 +63 XXX XXX XXXX</li>
          <li>📧 tadiosas@email.com</li>
        </ul>
        <a href="mailto:tadiosas@email.com" className={styles.btn}>
          Book an Appointment
        </a>
      </div>
    </section>
  );
}
