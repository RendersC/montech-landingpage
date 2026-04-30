import React from 'react';
import Marquee from './Marquee';

/* Tech-stack badges that scroll horizontally between Hero and Services. */
const STACK = [
  'OpenAI',  'Claude',  'Python',     'Node.js',
  'React',   'Next.js', 'Tailwind',   'PostgreSQL',
  'Redis',   'Docker',  'AWS',        'Telegram Bot API',
  'WhatsApp', 'LangChain', 'Three.js', 'Appwrite',
];

const TechBadge = ({ label }) => (
  <div style={{
    display:        'flex',
    alignItems:     'center',
    gap:            10,
    padding:        '10px 22px',
    background:     'transparent',
    border:         '1px solid var(--c-border-2)',
    fontFamily:     '"Barlow Condensed", sans-serif',
    fontSize:       '1rem',
    fontWeight:     700,
    letterSpacing:  '0.16em',
    textTransform:  'uppercase',
    color:          'var(--c-text-2)',
    whiteSpace:     'nowrap',
    clipPath:       'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
  }}>
    <div className="diamond-clip" style={{ width: 8, height: 8, background: 'var(--c-accent)' }} />
    {label}
  </div>
);

const TechMarquee = () => (
  <section style={{
    background:   'var(--c-bg)',
    padding:      '2.5rem 0',
    borderTop:    '1px solid var(--c-border)',
    borderBottom: '1px solid var(--c-border)',
    position:     'relative',
  }}>
    <Marquee speed={50} gap={20}>
      {STACK.map(s => <TechBadge key={s} label={s} />)}
    </Marquee>
  </section>
);

export default TechMarquee;
