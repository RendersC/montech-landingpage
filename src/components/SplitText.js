import React from 'react';
import { motion } from 'framer-motion';

/**
 * Splits text into characters or words and reveals each with a stagger.
 * Each token animates from below with a slight blur, individually wrapped
 * in an overflow-hidden box so the slide-up reads cleanly.
 *
 * Word mode: words wrap at natural break points, never mid-word.
 */
const SplitText = ({ text, by = 'char', delay = 0, stagger = 0.03, className, style, color }) => {
  // Build tokens. In word mode each token is a word; the space goes between as
  // a plain text node, so the line can break there naturally.
  const tokens = by === 'word'
    ? text.split(' ').filter(Boolean)
    : text.split('');

  const containerV = {
    hidden:  { opacity: 1 },
    visible: { opacity: 1, transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  const charV = {
    hidden:  { y: '100%', opacity: 0, filter: 'blur(8px)' },
    visible: { y: '0%',   opacity: 1, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <motion.span
      variants={containerV}
      initial="hidden"
      animate="visible"
      className={className}
      style={{ display: 'inline', ...style }}
    >
      {tokens.map((t, i) => (
        <React.Fragment key={i}>
          <span
            style={{
              display:       'inline-block',
              overflow:      'hidden',
              verticalAlign: 'top',
              lineHeight:    'inherit',
            }}
          >
            <motion.span
              variants={charV}
              style={{ display: 'inline-block', color, whiteSpace: 'pre' }}
            >
              {t === ' ' ? ' ' : t}
            </motion.span>
          </span>
          {/* Real space between words so the line can break here */}
          {by === 'word' && i < tokens.length - 1 ? ' ' : null}
        </React.Fragment>
      ))}
    </motion.span>
  );
};

export default SplitText;
