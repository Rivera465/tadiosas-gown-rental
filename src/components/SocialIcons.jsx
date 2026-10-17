/**
 * src/components/SocialIcons.jsx
 *
 * Shared social-media icon links (Facebook, Instagram, TikTok) rendered as
 * clean inline SVG icons — no text, no icon-font/library dependency. Used by
 * both the Footer and the Contact modal so the links + markup stay in one place.
 *
 * Pass a `className` for the wrapper so each consumer can style spacing/color.
 * Icons inherit `currentColor`, so the parent controls their color via CSS.
 */

const LINKS = {
  facebook:  'https://www.facebook.com/share/1DSg8i2BoY/',
  instagram: 'https://www.instagram.com/tadiosagown',
  tiktok:    'https://www.tiktok.com/@tadiosasgownrental',
};

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.14 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.9h-2.34V22c4.78-.8 8.44-4.94 8.44-9.94Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M16.5 3c.3 2.1 1.6 3.6 3.5 3.9v2.6c-1.3.1-2.5-.3-3.6-1v6.1c0 3.3-2.5 5.4-5.3 5.4A5.1 5.1 0 0 1 6 15c0-3 2.4-5.1 5.4-4.9v2.7c-.4-.1-.9-.2-1.3-.1-1.2.2-2 1.1-1.9 2.4a2.2 2.2 0 0 0 4.3-.5V3h4Z" />
    </svg>
  );
}

/**
 * @param {{ className?: string, itemClassName?: string }} props
 *   className — wrapper class; itemClassName — class for each <a> link.
 */
export default function SocialIcons({ className, itemClassName }) {
  return (
    <div className={className}>
      <a href={LINKS.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className={itemClassName}>
        <FacebookIcon />
      </a>
      <a href={LINKS.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className={itemClassName}>
        <InstagramIcon />
      </a>
      <a href={LINKS.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok" className={itemClassName}>
        <TikTokIcon />
      </a>
    </div>
  );
}
