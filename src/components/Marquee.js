import React from 'react';

/**
 * Infinite horizontal marquee — duplicates children and animates with CSS.
 * Best used for tech-stack badges or trusted-by logos.
 */
const Marquee = ({ children, speed = 36, reverse = false, gap = 48, className }) => {
  const items = Array.isArray(children) ? children : [children];

  return (
    <div
      className={className}
      style={{
        overflow:    'hidden',
        position:    'relative',
        maskImage:   'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
      }}
    >
      <div
        style={{
          display:   'flex',
          gap,
          width:     'max-content',
          animation: `marquee-scroll ${speed}s linear infinite ${reverse ? 'reverse' : ''}`,
        }}
      >
        {[...items, ...items, ...items].map((c, i) => (
          <div key={i} style={{ flexShrink: 0 }}>{c}</div>
        ))}
      </div>

      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(calc(-100% / 3)); }
        }
      `}</style>
    </div>
  );
};

export default Marquee;
