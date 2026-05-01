import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Clock, Brain, Users, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AnimatedCounter from './AnimatedCounter';
import MagneticButton from './MagneticButton';

const FEATURES = [
  { icon: DollarSign, key: 'payAfter',       accent: 'rgba(79,195,195,0.72)'   },
  { icon: Clock,      key: 'fastTransparent', accent: 'rgba(38,80,119,0.9)'    },
  { icon: Brain,      key: 'expertise',       accent: 'rgba(232,75,58,0.65)'   },
  { icon: Users,      key: 'tailored',        accent: 'rgba(45,95,93,0.88)'    },
];

const STATS = [
  { to: 50,  suffix: '+',  key: 'projects'     },
  { to: 98,  suffix: '%',  key: 'satisfaction' },
  { to: 24,  suffix: '/7', key: 'support'      },
  { to: 2,   suffix: 'x',  key: 'delivery'     },
];

const WhyChooseUs = () => {
  const { t } = useTranslation();

  return (
    <section
      id="why-us"
      style={{ background: 'var(--c-bg)', padding: '6rem 0', position: 'relative', overflow: 'hidden' }}
    >
      {/* Atmospheric right-side glow */}
      <div
        className="diamond-clip"
        style={{
          position:   'absolute',
          right:      -240,
          top:        '50%',
          transform:  'translateY(-50%)',
          width:      520,
          height:     520,
          background: 'radial-gradient(circle, rgba(38,80,119,0.14) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container mx-auto px-6 lg:px-12 relative" style={{ zIndex: 1 }}>
        <div
          style={{
            display:  'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap:      '4rem',
            alignItems: 'start',
          }}
        >
          {/* ── Left column: title + stats + CTA ──────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="section-eyebrow" style={{ marginBottom: 14 }}>
              {t('why.title.part1')}
            </span>
            <h2
              className="display-title"
              style={{ fontSize: 'clamp(2.6rem, 7vw, 5.2rem)', color: 'white', marginBottom: '1.5rem' }}
            >
              {t('why.title.part2')}
            </h2>
            <p style={{ color: 'var(--c-text-2)', lineHeight: 1.78, fontSize: '0.92rem', maxWidth: 420, marginBottom: '2.8rem' }}>
              {t('why.subtitle')}
            </p>

            {/* Stats 2×2 grid */}
            <div
              style={{
                display:   'grid',
                gridTemplateColumns: '1fr 1fr',
                gap:       1,
                background: 'var(--c-border)',
                marginBottom: '2.5rem',
              }}
            >
              {STATS.map(({ to, suffix, key }, i) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  whileHover={{ y: -4 }}
                  style={{
                    background: 'var(--c-surface)',
                    padding:    '1.4rem',
                    position:   'relative',
                    transition: 'background 0.25s ease',
                  }}
                >
                  <AnimatedCounter
                    to={to}
                    suffix={suffix}
                    duration={1.6 + i * 0.15}
                    className="display-title"
                    style={{ fontSize: '2.4rem', color: 'var(--c-accent)', marginBottom: 4, display: 'block' }}
                  />
                  <div style={{ color: 'var(--c-text-3)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {t(`why.stats.${key}`)}
                  </div>
                  <div
                    className="diamond-clip"
                    style={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, background: 'rgba(79,195,195,0.18)' }}
                  />
                </motion.div>
              ))}
            </div>

          </motion.div>

          {/* ── Right column: feature panels ──────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--c-border)' }}>
            {FEATURES.map(({ icon: Icon, key, accent }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: 28 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="dark-card"
                style={{
                  display:    'flex',
                  alignItems: 'flex-start',
                  gap:        '1.25rem',
                  padding:    '1.5rem 1.75rem',
                  position:   'relative',
                  overflow:   'hidden',
                }}
              >
                {/* Icon diamond */}
                <div
                  className="diamond-clip"
                  style={{
                    width:      44,
                    height:     44,
                    background: accent,
                    display:    'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop:  2,
                  }}
                >
                  <Icon size={18} color="white" />
                </div>

                <div>
                  <h3
                    className="display-title"
                    style={{ fontSize: '1.1rem', color: 'white', marginBottom: 8 }}
                  >
                    {t(`why.features.${key}.title`)}
                  </h3>
                  <p style={{ color: 'var(--c-text-2)', fontSize: '0.84rem', lineHeight: 1.68 }}>
                    {t(`why.features.${key}.description`)}
                  </p>
                </div>

                {/* Left accent bar (shown on hover via CSS) */}
                <div
                  style={{
                    position:   'absolute',
                    left:       0,
                    top:        0,
                    bottom:     0,
                    width:      2,
                    background: accent,
                    opacity:    0,
                    transition: 'opacity 0.3s ease',
                  }}
                  className="feature-bar"
                />
                <style>{`.dark-card:hover .feature-bar { opacity: 1 !important; }`}</style>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Centered bottom CTA — fixes column asymmetry ────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ textAlign: 'center', marginTop: '4rem' }}
        >
          <p style={{ color: 'var(--c-text-2)', fontSize: '0.92rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
            {t('why.bottomCta.text')}
          </p>
          <MagneticButton
            strength={18}
            className="btn-primary"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            {t('why.bottomCta.button')}
            <ArrowRight size={14} />
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
