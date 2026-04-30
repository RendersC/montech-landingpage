import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Zap, Target, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import MagneticButton from './MagneticButton';

const BENEFITS = [
  { Icon: Zap,        titleKey: 'cta.benefits.fast.title'     },
  { Icon: Target,     titleKey: 'cta.benefits.results.title'  },
  { Icon: TrendingUp, titleKey: 'cta.benefits.scalable.title' },
];

const CallToAction = () => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const scrollToContact = () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });

  /* Parallax of the giant background diamond */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const diamondY = useTransform(scrollYProgress, [0, 1], ['10%', '-10%']);
  const diamondR = useTransform(scrollYProgress, [0, 1], ['35deg', '55deg']);

  return (
    <section
      ref={sectionRef}
      style={{
        position:   'relative',
        padding:    '8rem 0 7rem',
        overflow:   'hidden',
        background: `
          linear-gradient(180deg,
            var(--c-bg)    0%,
            #021a35       30%,
            #022240       65%,
            var(--c-bg)  100%
          )
        `,
      }}
    >
      {/* ── Top diagonal cut ───────────────────────────────────────────── */}
      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 60, pointerEvents: 'none' }}
      >
        <polygon points="0,60 1440,0 1440,30 0,60" fill="var(--c-bg)" />
      </svg>

      {/* ── Bottom diagonal cut ────────────────────────────────────────── */}
      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 60, pointerEvents: 'none' }}
      >
        <polygon points="0,0 1440,30 1440,60 0,60" fill="var(--c-bg)" />
      </svg>

      {/* ── Massive parallax diamond on the right ─────────────────────── */}
      <motion.div
        aria-hidden
        className="diamond-clip"
        style={{
          position:   'absolute',
          top:        '50%',
          right:      '-12%',
          width:      'min(680px, 70vw)',
          height:     'min(680px, 70vw)',
          background: 'transparent',
          outline:    '1px solid rgba(79,195,195,0.22)',
          y:          diamondY,
          rotate:     diamondR,
          pointerEvents: 'none',
        }}
      />
      <motion.div
        aria-hidden
        className="diamond-clip"
        style={{
          position:   'absolute',
          top:        '50%',
          right:      '-8%',
          width:      'min(520px, 55vw)',
          height:     'min(520px, 55vw)',
          background: 'transparent',
          outline:    '1px solid rgba(232,75,58,0.18)',
          y:          diamondY,
          rotate:     diamondR,
          marginTop:  '-20%',
          pointerEvents: 'none',
        }}
      />
      <motion.div
        aria-hidden
        className="diamond-clip"
        style={{
          position:   'absolute',
          top:        '50%',
          right:      '0%',
          width:      'min(360px, 40vw)',
          height:     'min(360px, 40vw)',
          background: 'radial-gradient(circle, rgba(79,195,195,0.18) 0%, transparent 65%)',
          y:          diamondY,
          rotate:     diamondR,
          marginTop:  '-15%',
          pointerEvents: 'none',
        }}
      />

      {/* ── Spotlight glow on the left ───────────────────────────────── */}
      <div
        style={{
          position:   'absolute',
          top:        '20%',
          left:       '-10%',
          width:      560,
          height:     560,
          background: 'radial-gradient(circle, rgba(45,95,93,0.22) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Subtle grid mask ──────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset:    0,
          opacity:  0.04,
          backgroundImage: `
            linear-gradient(rgba(79,195,195,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(79,195,195,1) 1px, transparent 1px)
          `,
          backgroundSize:  '90px 90px',
          maskImage:        'linear-gradient(135deg, transparent 30%, black 80%)',
          WebkitMaskImage:  'linear-gradient(135deg, transparent 30%, black 80%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Content ───────────────────────────────────────────────────── */}
      <div className="container mx-auto px-6 lg:px-12 relative" style={{ zIndex: 2 }}>
        <div
          style={{
            maxWidth: 1120,
            display:  'grid',
            gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 0.6fr)',
            gap:      '3rem',
            alignItems: 'end',
          }}
          className="cta-grid"
        >
          {/* ── Left: editorial typography ──────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
              <div className="diamond-clip" style={{ width: 8, height: 8, background: 'var(--c-accent)' }} />
              <span className="section-eyebrow">{t('cta.eyebrow') !== 'cta.eyebrow' ? t('cta.eyebrow') : 'Final Step'}</span>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, rgba(79,195,195,0.5), transparent)', maxWidth: 260 }} />
            </div>

            <h2
              className="display-title"
              style={{
                fontSize:     'clamp(2.8rem, 7vw, 6rem)',
                color:        'white',
                marginBottom: '2rem',
                wordBreak:    'keep-all',
                overflowWrap: 'normal',
              }}
            >
              {t('cta.title')}
            </h2>

            <p
              style={{
                color:        'var(--c-text-2)',
                fontSize:     '1.05rem',
                lineHeight:   1.72,
                marginBottom: '2.75rem',
                maxWidth:     520,
                fontWeight:   300,
              }}
            >
              {t('cta.subtitle')}
            </p>

            <div
              style={{
                display:    'flex',
                flexWrap:   'wrap',
                alignItems: 'center',
                gap:        '2rem',
              }}
            >
              <MagneticButton strength={22} className="btn-primary" onClick={scrollToContact}>
                {t('getAQuote')}
                <ArrowRight size={15} />
              </MagneticButton>

              {/* Inline benefits — single row */}
              <ul
                style={{
                  display:    'flex',
                  flexWrap:   'wrap',
                  gap:        '1.5rem',
                  listStyle:  'none',
                  padding:    0,
                  margin:     0,
                }}
              >
                {BENEFITS.map(({ Icon, titleKey }, i) => (
                  <li
                    key={titleKey}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--c-text-3)', fontSize: '0.78rem', letterSpacing: '0.06em' }}
                  >
                    <Icon size={14} style={{ color: 'var(--c-accent)' }} />
                    <span>{t(titleKey)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* ── Right: editorial number/marker ────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="cta-marker"
            style={{
              position:    'relative',
              display:     'flex',
              flexDirection: 'column',
              alignItems:  'flex-end',
              gap:         12,
              paddingBottom: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: '0.68rem', letterSpacing: '0.3em', color: 'var(--c-text-3)', textTransform: 'uppercase' }}>
                Step
              </span>
              <div style={{ width: 28, height: 1, background: 'var(--c-accent)' }} />
            </div>

            <div
              className="display-title"
              style={{
                fontSize:      'clamp(7rem, 15vw, 14rem)',
                lineHeight:    0.85,
                letterSpacing: '-0.05em',
                background:    'linear-gradient(135deg, rgba(79,195,195,0.6) 0%, rgba(79,195,195,0.1) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor:  'transparent',
                backgroundClip:        'text',
              }}
            >
              04
            </div>

            <div
              className="diamond-clip"
              style={{
                width:      24,
                height:     24,
                background: 'transparent',
                outline:    '1px solid var(--c-accent)',
              }}
            />
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 800px) {
          .cta-grid { grid-template-columns: 1fr !important; }
          .cta-marker { align-items: flex-start !important; }
        }
      `}</style>
    </section>
  );
};

export default CallToAction;
