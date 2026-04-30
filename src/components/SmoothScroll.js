import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Wraps the app to give smooth, momentum-based scrolling.
 * Anchor links and scrollIntoView still work because we hook into rAF.
 */
const SmoothScroll = ({ children }) => {
  useEffect(() => {
    const lenis = new Lenis({
      duration:    1.15,
      easing:      (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
      touchMultiplier: 1.5,
    });

    // Sync framer-motion / scroll-driven animations
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Forward native anchor / scrollIntoView through Lenis
    const handleAnchor = (e) => {
      const target = e.target.closest('button, a');
      if (!target) return;
      const id = target.getAttribute('data-scroll-to');
      if (id) {
        e.preventDefault();
        const el = document.getElementById(id);
        if (el) lenis.scrollTo(el, { offset: -60 });
      }
    };
    document.addEventListener('click', handleAnchor);

    // Also intercept scrollIntoView calls
    const origScrollIntoView = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = function (opts) {
      if (opts && opts.behavior === 'smooth') {
        lenis.scrollTo(this, { offset: -60 });
      } else {
        origScrollIntoView.call(this, opts);
      }
    };

    return () => {
      lenis.destroy();
      document.removeEventListener('click', handleAnchor);
      Element.prototype.scrollIntoView = origScrollIntoView;
    };
  }, []);

  return children;
};

export default SmoothScroll;
