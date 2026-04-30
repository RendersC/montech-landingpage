import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, Bot, Zap, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Crystal3D from './Crystal3D';
import SplitText from './SplitText';
import MagneticButton from './MagneticButton';

/* ── Decorative diamond ─────────────────────────────────────────────────── */
const Diamond = ({ size, style = {}, animate: anim, delay = 0 }) => (
  <motion.div
    style={{
      position:  'absolute',
      width:     size,
      height:    size,
      clipPath:  'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
      pointerEvents: 'none',
      ...style,
    }}
    animate={anim}
    transition={{ duration: 8 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
  />
);

const Tri = ({ x, y, size = 14, color, dir = 'up', opacity = 1 }) => {
  const b = {
    up:    { borderLeft: `${size * 0.6}px solid transparent`, borderRight: `${size * 0.6}px solid transparent`, borderBottom: `${size}px solid ${color}` },
    right: { borderTop: `${size * 0.6}px solid transparent`, borderBottom: `${size * 0.6}px solid transparent`, borderLeft: `${size}px solid ${color}` },
    down:  { borderLeft: `${size * 0.6}px solid transparent`, borderRight: `${size * 0.6}px solid transparent`, borderTop: `${size}px solid ${color}` },
  };
  return (
    <div style={{
      position: 'absolute', left: x, top: y, width: 0, height: 0, opacity,
      pointerEvents: 'none', ...b[dir],
    }} />
  );
};

const Hero = () => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const [titleKey, setTitleKey] = useState(0);

  /* Re-trigger split-text on language change */
  useEffect(() => {
    setTitleKey(k => k + 1);
  }, [t]);

  /* Mouse-parallax for the bg image */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 30, damping: 20 });
  const sy = useSpring(my, { stiffness: 30, damping: 20 });
  const bgX = useTransform(sx, [-1, 1], ['-2.5%', '2.5%']);
  const bgY = useTransform(sy, [-1, 1], ['-2.5%', '2.5%']);

  /* Scroll-driven hero fade-out */
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroY       = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  useEffect(() => {
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth)  * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mx.set(x); my.set(y);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [mx, my]);

  const scrollToContact = () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section
      id="hero"
      ref={sectionRef}
      style={{
        position:   'relative',
        minHeight:  '100vh',
        display:    'flex',
        alignItems: 'center',
        overflow:   'hidden',
        backgroundColor: 'var(--c-bg)',
      }}
    >
      {/* ── BG image with mouse parallax ─────────────────────────────────── */}
      <motion.div
        style={{
          position:           'absolute',
          inset:              -20,
          backgroundImage:    'url(/hero-bg.jpg)',
          backgroundSize:     'cover',
          backgroundPosition: 'center center',
          backgroundRepeat:   'no-repeat',
          x: bgX,
          y: bgY,
          willChange: 'transform',
        }}
      />

      {/* Dark overlay */}
      <div
        style={{
          position: 'absolute',
          inset:    0,
          background: `
            linear-gradient(155deg,
              rgba(2,33,64,0.78)   0%,
              rgba(1,13,26,0.86)  50%,
              rgba(1,13,26,0.96) 100%
            )
          `,
        }}
      />

      {/* Subtle dot-grid */}
      <div
        style={{
          position: 'absolute', inset: 0, opacity: 0.035,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)
          `,
          backgroundSize: '68px 68px',
          pointerEvents: 'none',
        }}
      />

      {/* Atmospheric glows */}
      <Diamond
        size={680}
        style={{ top: -220, right: -180, background: 'radial-gradient(circle, rgba(38,80,119,0.22) 0%, transparent 68%)' }}
        animate={{ scale: [1, 1.05, 1], opacity: [0.6, 0.9, 0.6] }}
      />
      <Diamond
        size={460}
        style={{ bottom: -160, left: -120, background: 'radial-gradient(circle, rgba(45,95,93,0.18) 0%, transparent 68%)' }}
        animate={{ scale: [1, 1.09, 1], opacity: [0.5, 0.8, 0.5] }}
        delay={2}
      />

      {/* Floating diamond decorators */}
      <Diamond size={56} style={{ top: '40%', right: '5%', background: 'rgba(79,195,195,0.13)', outline: '1px solid rgba(79,195,195,0.35)' }}
               animate={{ y: [0, 14, 0] }} delay={1.5} />
      <Diamond size={140} style={{ bottom: '20%', left: '5%', background: 'rgba(30,66,88,0.42)' }}
               animate={{ y: [0, -11, 0] }} delay={0.7} />
      <Diamond size={48} style={{ top: '22%', left: '13%', background: 'rgba(232,75,58,0.28)', outline: '1px solid rgba(232,75,58,0.55)' }}
               animate={{ y: [0, 11, 0] }} delay={2.5} />
      <Diamond size={30} style={{ bottom: '30%', right: '21%', background: 'rgba(232,75,58,0.68)' }}
               animate={{ y: [0, -7, 0] }} delay={1} />
      <Diamond size={18} style={{ top: '54%', left: '19%', background: 'rgba(79,195,195,0.85)' }}
               animate={{ y: [0, 9, 0] }} delay={3} />

      <Tri x="9%"  y="28%" size={18} color="rgba(232,75,58,0.78)" dir="up"    />
      <Tri x="63%" y="65%" size={12} color="rgba(232,75,58,0.52)" dir="up"    />
      <Tri x="29%" y="74%" size={22} color="rgba(232,75,58,0.42)" dir="down"  />
      <Tri x="14%" y="65%" size={11} color="rgba(79,195,195,0.45)" dir="down" />
      <Tri x="26%" y="16%" size={10} color="rgba(79,195,195,0.48)" dir="up"   />

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <motion.div
        className="container mx-auto relative z-10"
        style={{
          padding: '0 1.5rem',
          paddingTop: '7rem',
          paddingBottom: '5rem',
          opacity: heroOpacity,
          y: heroY,
        }}
      >
        <div
          style={{
            display:   'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 0.85fr)',
            gap:       '2rem',
            alignItems: 'center',
          }}
          className="hero-grid"
        >
          {/* Text column */}
          <div style={{ maxWidth: 720 }}>
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 32 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                style={{ height: 1, background: 'var(--c-accent)', opacity: 0.7 }}
              />
              <span className="section-eyebrow">IT Solutions</span>
            </motion.div>

            {/* Headline with split-text reveal — word-by-word so words don't break across lines */}
            <h1
              key={titleKey}
              className="display-title"
              style={{
                fontSize:      'clamp(2.5rem, 5.8vw, 5rem)',
                color:         'white',
                marginBottom:  '1.4rem',
                wordBreak:     'keep-all',
                overflowWrap:  'normal',
              }}
            >
              <SplitText text={t('hero.headline1')} delay={0.2} stagger={0.08} by="word" />
              {' '}
              <SplitText
                text={t('hero.headlineHighlight')}
                delay={0.7}
                stagger={0.08}
                by="word"
                color="var(--c-accent)"
              />
              <br />
              <SplitText
                text={t('hero.headline2')}
                delay={1.0}
                stagger={0.08}
                by="word"
                color="rgba(255,255,255,0.82)"
              />
            </h1>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              style={{
                color:      'var(--c-text-2)',
                fontSize:   '1.05rem',
                lineHeight: 1.75,
                maxWidth:   500,
                marginBottom: '2.5rem',
                fontWeight: 300,
              }}
            >
              {t('hero.subheadline')}
            </motion.p>

            {/* Magnetic CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.55 }}
              style={{ marginBottom: '3.5rem' }}
            >
              <MagneticButton
                strength={20}
                className="btn-primary"
                onClick={scrollToContact}
              >
                {t('getAQuote')}
                <ArrowRight size={15} />
              </MagneticButton>
            </motion.div>

            {/* Feature trio */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.7, staggerChildren: 0.1 }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}
            >
              {[
                { Icon: Bot,   key: 'aiPowered' },
                { Icon: Zap,   key: 'fast' },
                { Icon: Globe, key: 'global' },
              ].map(({ Icon, key }, i) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.7 + i * 0.1 }}
                  whileHover={{ y: -3 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--c-text-3)' }}
                >
                  <motion.div
                    className="diamond-clip"
                    whileHover={{ rotate: 90, scale: 1.15 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    style={{
                      width: 30, height: 30,
                      background: 'rgba(79,195,195,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={13} color="var(--c-accent)" />
                  </motion.div>
                  <span style={{ fontSize: '0.78rem', letterSpacing: '0.07em', fontWeight: 500 }}>
                    {t(`hero.features.${key}`)}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* 3D Crystal column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="hero-crystal-wrap"
            style={{
              width:  '100%',
              height: 'min(540px, 60vh)',
              position: 'relative',
            }}
          >
            <Crystal3D style={{ width: '100%', height: '100%' }} />

            {/* Glow behind crystal */}
            <div
              style={{
                position: 'absolute',
                inset: '15%',
                background: 'radial-gradient(circle, rgba(79,195,195,0.18) 0%, transparent 70%)',
                pointerEvents: 'none',
                zIndex: -1,
              }}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom fade */}
      <div
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: 80,
          background: 'linear-gradient(to bottom, transparent, var(--c-bg))',
          pointerEvents: 'none',
        }}
      />

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 9, 0] }}
        transition={{ duration: 2.8, repeat: Infinity }}
        style={{
          position: 'absolute', bottom: 28, left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          pointerEvents: 'none',
        }}
      >
        <div style={{ width: 1, height: 36, background: 'linear-gradient(to bottom, transparent, rgba(79,195,195,0.4))' }} />
        <div className="diamond-clip" style={{ width: 6, height: 6, background: 'var(--c-accent)', opacity: 0.5 }} />
      </motion.div>

      {/* Responsive: stack vertically on mobile, hide crystal on small screens */}
      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-crystal-wrap { height: 360px !important; order: -1; margin-bottom: 1rem; }
        }
        @media (max-width: 600px) {
          .hero-crystal-wrap { display: none; }
        }
      `}</style>
    </section>
  );
};

export default Hero;
