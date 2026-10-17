/**
 * src/utils/imgFallback.js
 *
 * Last-line-of-defense image fallback. Your data-level fallback (url || default)
 * handles "the API gave no URL". This handles the SECOND failure point: the API
 * gave a valid URL, but the image at that URL fails to LOAD (Cloudinary down, a
 * deleted asset still referenced in the DB, a network hiccup). Without this the
 * browser shows a broken-image icon; with it, the <img> silently swaps to a
 * bundled default.
 *
 * Usage:
 *   <img src={someUrl} onError={imgFallback('/for home and event page.jpg')} />
 *
 * Loop-safe: a per-element flag ensures the swap happens AT MOST ONCE, so if the
 * fallback itself ever fails it won't retrigger an infinite error loop.
 */

/**
 * A neutral "image unavailable" placeholder as an inline SVG data-URI. Used as
 * the fallback for rental ITEM photos (which have no single bundled default).
 * Being a data-URI, it is embedded in the page and can never itself fail to
 * load — so it's a safe terminal fallback.
 */
export const ITEM_IMAGE_PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="533" viewBox="0 0 400 533">
       <rect width="400" height="533" fill="#efece7"/>
       <g fill="none" stroke="#c9c2b8" stroke-width="4">
         <rect x="150" y="210" width="100" height="80" rx="6"/>
         <circle cx="178" cy="236" r="9"/>
         <path d="M156 282l26-26 20 20 24-30 24 36"/>
       </g>
       <text x="200" y="330" text-anchor="middle" font-family="Montserrat, Arial, sans-serif"
             font-size="16" fill="#a79f93">Image unavailable</text>
     </svg>`,
  );

/**
 * Builds an onError handler that swaps a failed image to `fallbackSrc` once.
 * @param {string} fallbackSrc - a bundled/local default (lives with the deploy).
 * @returns {(e: { currentTarget: HTMLImageElement }) => void}
 */
export function imgFallback(fallbackSrc) {
  return (e) => {
    const el = e.currentTarget;
    if (!el || el.dataset.fellback === '1') return; // already swapped → stop
    el.dataset.fellback = '1';
    el.src = fallbackSrc;
  };
}
