import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Zap, Target, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import MagneticButton from './MagneticButton';

/* ── Floating diamond — drifts and rotates indefinitely ─────────────────── */
const FloatingDiamond = ({
  x, y, size,
  fill, outline,
  duration = 10, delay = 0,
  driftY = 24, driftX = 14, rot = 6,
  blur = 0,
  z = 1,
}) => (
  <motion.div
    aria-hidden
    className="diamond-clip"
    animate={{
      y:      [0, -driftY, 0, driftY * 0.8, 0],
      x:      [0,  driftX, 0, -driftX,      0],
      rotate: [0,  rot,    0, -rot,         0],
    }}
    transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
    style={{
      position:      'absolute',
      left:          x,
      top:           y,
      width:         size,
      height:        size,
      background:    fill || 'transparent',
      outline:       outline ? `1px solid ${outline}` : 'none',
      filter:        blur ? `blur(${blur}px)` : 'none',
      pointerEvents: 'none',
      zIndex:        z,
    }}
  />
);

/* ── Section ────────────────────────────────────────────────────────────── */
const CallToAction = () => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const scrollToContact = () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });

  /* Subtle parallax on the central spotlight */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const spotlightY = useTransform(scrollYProgress, [0, 1], ['8%', '-8%']);

  return (
    <section
      ref={sectionRef}
      style={{
        position:   'relative',
        padding:    '9rem 1rem 8rem',
        overflow:   'hidden',
        /* Radial gradient that fades to var(--c-bg) at edges → seamless join with neighbours */
        background: `
          radial-gradient(ellipse 120% 90% at center, #022240 0%, #021932 45%, var(--c-bg) 100%)
        `,
      }}
    >
      {/* ── Centered spotlight glow with scroll parallax ──────────────────── */}
      <motion.div
        style={{
          position:  'absolute',
          top:       '50%',
          left:      '50%',
          width:     900,
          height:    900,
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(79,195,195,0.14) 0%, transparent 60%)',
          y:         spotlightY,
          pointerEvents: 'none',
        }}
      />

      {/* ── Floating geometric decorations ──────────────────────────────── */}
      {/* Large outlined diamonds — far back, very subtle */}
      <FloatingDiamond x="6%"   y="14%"  size={170} outline="rgba(79,195,195,0.18)" duration={16} delay={0}   driftY={30} />
      <FloatingDiamond x="84%"  y="78%"  size={200} outline="rgba(79,195,195,0.16)" duration={18} delay={2}   driftY={28} />
      <FloatingDiamond x="78%"  y="12%"  size={120} outline="rgba(232,75,58,0.22)"  duration={14} delay={1}   driftY={26} />
      <FloatingDiamond x="12%"  y="80%"  size={100} outline="rgba(125,211,210,0.28)" duration={13} delay={3}  driftY={22} />

      {/* Medium solid diamonds — mid-layer */}
      <FloatingDiamond x="89%"  y="22%"  size={50}  fill="rgba(232,75,58,0.55)"     duration={9}  delay={1.5} driftY={18} />
      <FloatingDiamond x="9%"   y="45%"  size={36}  fill="rgba(79,195,195,0.45)"    duration={11} delay={2.2} driftY={20} />
      <FloatingDiamond x="92%"  y="60%"  size={28}  fill="rgba(125,211,210,0.7)"    duration={10} delay={0.5} driftY={15} />
      <FloatingDiamond x="14%"  y="22%"  size={42}  fill="rgba(232,75,58,0.4)"      outline="rgba(232,75,58,0.7)" duration={12} delay={2.8} driftY={18} />

      {/* Small bright diamonds — accent sparkles */}
      <FloatingDiamond x="22%"  y="70%"  size={14}  fill="rgba(125,211,210,0.9)"    duration={7}  delay={1}   driftY={12} />
      <FloatingDiamond x="80%"  y="42%"  size={18}  fill="rgba(79,195,195,0.85)"    duration={8}  delay={2}   driftY={14} />
      <FloatingDiamond x="48%"  y="6%"   size={12}  fill="rgba(255,255,255,0.55)"   duration={9}  delay={1.5} driftY={10} />
      <FloatingDiamond x="50%"  y="94%"  size={16}  fill="rgba(232,75,58,0.7)"      duration={10} delay={3}   driftY={11} />

      {/* Soft blurred glow blobs */}
      <FloatingDiamond x="4%"   y="55%"  size={260} fill="rgba(38,80,119,0.45)"     duration={20} delay={0}   driftY={16} blur={50} z={0} />
      <FloatingDiamond x="86%"  y="38%"  size={220} fill="rgba(45,95,93,0.5)"       duration={22} delay={4}   driftY={18} blur={45} z={0} />

      {/* ── Content — centered, symmetric ─────────────────────────────── */}
      <div className="container mx-auto px-6 relative" style={{ zIndex: 5 }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ maxWidth: 880, margin: '0 auto', textAlign: 'center' }}
        >
          {/* Eyebrow with mirrored lines */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 36 }}>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              style={{ height: 1, background: 'linear-gradient(to right, transparent, var(--c-accent))' }}
            />
            <span className="section-eyebrow">Final Step</span>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              style={{ height: 1, background: 'linear-gradient(to left, transparent, var(--c-accent))' }}
            />
          </div>

          {/* Headline */}
          <h2
            className="display-title"
            style={{
              fontSize:     'clamp(2.6rem, 6.5vw, 5.5rem)',
              color:        'white',
              marginBottom: '1.5rem',
              wordBreak:    'keep-all',
              overflowWrap: 'normal',
              textWrap:     'balance',
            }}
          >
            {t('cta.title')}
          </h2>

          {/* Subtitle */}
          <p
            style={{
              color:      'var(--c-text-2)',
              fontSize:   '1.08rem',
              lineHeight: 1.72,
              maxWidth:   580,
              margin:     '0 auto 3rem',
              fontWeight: 300,
            }}
          >
            {t('cta.subtitle')}
          </p>

          {/* CTA — centered */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3.5rem' }}>
            <MagneticButton strength={24} className="btn-primary" onClick={scrollToContact}>
              {t('getAQuote')}
              <ArrowRight size={15} />
            </MagneticButton>
          </div>

          {/* Decorative diamond divider */}
          <div
            style={{
              display:    'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap:        12,
              marginBottom: '2.5rem',
            }}
          >
            <div style={{ flex: 1, maxWidth: 120, height: 1, background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.12))' }} />
            <div className="diamond-clip" style={{ width: 8,  height: 8,  background: 'rgba(79,195,195,0.55)' }} />
            <div className="diamond-clip" style={{ width: 12, height: 12, background: 'var(--c-accent)' }} />
            <div className="diamond-clip" style={{ width: 8,  height: 8,  background: 'rgba(79,195,195,0.55)' }} />
            <div style={{ flex: 1, maxWidth: 120, height: 1, background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.12))' }} />
          </div>

          {/* Benefits row — symmetric, centered */}
          <div
            style={{
              display:        'flex',
              justifyContent: 'center',
              flexWrap:       'wrap',
              gap:            '2.75rem',
            }}
          >
            {[
              { Icon: Zap,        titleKey: 'cta.benefits.fast.title'     },
              { Icon: Target,     titleKey: 'cta.benefits.results.title'  },
              { Icon: TrendingUp, titleKey: 'cta.benefits.scalable.title' },
            ].map(({ Icon, titleKey }, i) => (
              <motion.div
                key={titleKey}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                whileHover={{ y: -3 }}
                style={{
                  display:      'flex',
                  alignItems:   'center',
                  gap:          12,
                  color:        'var(--c-text-2)',
                  fontSize:     '0.85rem',
                  letterSpacing: '0.05em',
                }}
              >
                <div
                  className="diamond-clip"
                  style={{
                    width:      32,
                    height:     32,
                    background: 'rgba(79,195,195,0.1)',
                    display:    'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={14} style={{ color: 'var(--c-accent)' }} />
                </div>
                <span>{t(titleKey)}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
