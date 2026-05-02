import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Bot, Globe, ArrowRight, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/* ── Per-card accent palette ──────────────────────────────────────────────── */
const ACCENTS = [
  '#4FC3C3',   // teal — chatbots
  '#E84B3A',   // coral — AI
  '#7DD3D2',   // light teal — landing
];

/* ── Service card ─────────────────────────────────────────────────────────── */
const ServiceCard = ({ service, index, onOpen, learnMoreLabel, number, accent }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
    whileHover="hover"
    onClick={() => onOpen(index)}
    className="service-card"
    style={{
      position:    'relative',
      padding:     '3.25rem 2.25rem 2.5rem',
      background:  'linear-gradient(180deg, rgba(15,58,99,0.55) 0%, rgba(2,33,64,0.62) 100%)',
      border:      '1px solid rgba(255,255,255,0.06)',
      backdropFilter:        'blur(14px)',
      WebkitBackdropFilter:  'blur(14px)',
      cursor:      'pointer',
      overflow:    'hidden',
      transition:  'border-color 0.4s ease, background 0.4s ease',
    }}
  >
    {/* Top accent bar — animates in on view */}
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, delay: 0.3 + index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 2, background: accent, transformOrigin: 'left',
        boxShadow: `0 0 16px ${accent}aa`,
      }}
    />

    {/* Massive ghost number */}
    <div style={{
      position:       'absolute',
      top:            10,
      right:          16,
      fontFamily:     '"Barlow Condensed", sans-serif',
      fontSize:       '5rem',
      fontWeight:     900,
      lineHeight:     0.85,
      color:          accent,
      opacity:        0.15,
      letterSpacing:  '-0.05em',
      pointerEvents:  'none',
    }}>
      {number}
    </div>

    {/* Icon block — diamond with outer outline echo */}
    <div style={{ position: 'relative', width: 96, height: 96, marginBottom: 32 }}>
      <motion.div
        variants={{ hover: { rotate: 90, scale: 1.05 } }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        className="diamond-clip"
        style={{
          width:      96,
          height:     96,
          background: `linear-gradient(135deg, ${accent}26 0%, ${accent}99 100%)`,
          display:    'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow:  `0 8px 32px ${accent}33`,
        }}
      >
        {/* counter-rotate to keep icon upright */}
        <motion.div
          variants={{ hover: { rotate: -90 } }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        >
          <service.icon size={34} color="white" />
        </motion.div>
      </motion.div>

      {/* Outlined echo behind the icon */}
      <div
        className="diamond-clip"
        style={{
          position:   'absolute',
          top:        -10,
          left:       -10,
          width:      116,
          height:     116,
          background: 'transparent',
          outline:    `1px solid ${accent}55`,
          opacity:    0.7,
        }}
      />
    </div>

    {/* Title */}
    <h3
      className="display-title"
      style={{
        fontSize:     '1.7rem',
        color:        'white',
        marginBottom: 14,
        transition:   'color 0.3s ease',
      }}
    >
      {service.title}
    </h3>

    {/* Description */}
    <p style={{ color: 'var(--c-text-2)', lineHeight: 1.75, marginBottom: '1.5rem', fontSize: '0.9rem' }}>
      {service.description}
    </p>

    {/* Feature list */}
    <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: '1.75rem' }}>
      {service.features.map((f, i) => (
        <li
          key={i}
          style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--c-text-3)', fontSize: '0.83rem' }}
        >
          <div
            className="diamond-clip"
            style={{ width: 7, height: 7, background: accent, flexShrink: 0 }}
          />
          {f}
        </li>
      ))}
    </ul>

    {/* Learn more — animates on hover */}
    <motion.div
      variants={{ hover: { x: 6 } }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display:        'inline-flex',
        alignItems:     'center',
        gap:            8,
        color:          accent,
        fontSize:       '0.72rem',
        letterSpacing:  '0.18em',
        textTransform:  'uppercase',
        fontWeight:     700,
      }}
    >
      {learnMoreLabel}
      <ArrowRight size={14} />
    </motion.div>

    {/* Bottom-right corner diamond accent */}
    <motion.div
      variants={{ hover: { rotate: 180, opacity: 1 } }}
      transition={{ duration: 0.5 }}
      className="diamond-clip"
      style={{
        position:   'absolute',
        bottom:     16,
        right:      16,
        width:      14,
        height:     14,
        background: accent,
        opacity:    0.4,
      }}
    />

    <style>{`
      .service-card:hover {
        background: linear-gradient(180deg, rgba(15,58,99,0.75) 0%, rgba(2,33,64,0.78) 100%) !important;
        border-color: ${accent}40 !important;
      }
    `}</style>
  </motion.div>
);

/* ── Section ──────────────────────────────────────────────────────────────── */
const Services = () => {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(null);

  const services = [
    {
      icon:        MessageCircle,
      key:         'chatbots',
      title:       t('servicesSection.cards.chatbots.title'),
      description: t('servicesSection.cards.chatbots.description'),
      features:    [0, 1, 2, 3].map(i => t(`servicesSection.cards.chatbots.features.${i}`)),
    },
    {
      icon:        Bot,
      key:         'ai',
      title:       t('servicesSection.cards.ai.title'),
      description: t('servicesSection.cards.ai.description'),
      features:    [0, 1, 2, 3].map(i => t(`servicesSection.cards.ai.features.${i}`)),
    },
    {
      icon:        Globe,
      key:         'landing',
      title:       t('servicesSection.cards.landing.title'),
      description: t('servicesSection.cards.landing.description'),
      features:    [0, 1, 2, 3].map(i => t(`servicesSection.cards.landing.features.${i}`)),
    },
  ];

  const activeService = openModal !== null ? services[openModal] : null;
  const activeAccent  = openModal !== null ? ACCENTS[openModal] : ACCENTS[0];

  return (
    <section
      id="services"
      style={{
        position:   'relative',
        padding:    '9rem 0 7rem',
        overflow:   'hidden',
        /* Smooth radial gradient — fades to var(--c-bg) at edges, no hard cuts */
        background: `
          radial-gradient(ellipse 110% 90% at center, #022240 0%, #021932 50%, var(--c-bg) 100%)
        `,
      }}
    >
      {/* ── Massive ghost watermark text ────────────────────────────────── */}
      <div
        aria-hidden
        style={{
          position:       'absolute',
          top:            '50%',
          left:           '50%',
          transform:      'translate(-50%, -50%)',
          fontFamily:     '"Barlow Condensed", sans-serif',
          fontWeight:     900,
          fontSize:       'clamp(12rem, 28vw, 24rem)',
          letterSpacing:  '-0.06em',
          lineHeight:     0.85,
          color:          'rgba(79, 195, 195, 0.022)',
          textTransform:  'uppercase',
          pointerEvents:  'none',
          whiteSpace:     'nowrap',
          userSelect:     'none',
        }}
      >
        SERVICES
      </div>

      {/* ── Center radial spotlight ──────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top:      '50%',
          left:     '50%',
          width:    900,
          height:   900,
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(79,195,195,0.09) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Floating diamond decorators ─────────────────────────────────── */}
      <motion.div
        animate={{ y: [0, -16, 0], opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="diamond-clip"
        style={{
          position: 'absolute', top: '18%', left: '6%',
          width: 90, height: 90,
          background: 'rgba(79,195,195,0.06)',
          outline:    '1px solid rgba(79,195,195,0.18)',
          pointerEvents: 'none',
        }}
      />
      <motion.div
        animate={{ y: [0, 14, 0], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="diamond-clip"
        style={{
          position: 'absolute', top: '22%', right: '5%',
          width: 60, height: 60,
          background: 'rgba(232,75,58,0.18)',
          pointerEvents: 'none',
        }}
      />
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="diamond-clip"
        style={{
          position: 'absolute', bottom: '20%', left: '12%',
          width: 32, height: 32,
          background: 'rgba(125,211,210,0.45)',
          pointerEvents: 'none',
        }}
      />
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 3.5 }}
        className="diamond-clip"
        style={{
          position: 'absolute', bottom: '24%', right: '14%',
          width: 22, height: 22,
          background: 'rgba(79,195,195,0.7)',
          pointerEvents: 'none',
        }}
      />
      <motion.div
        animate={{ y: [0, -12, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="diamond-clip"
        style={{
          position: 'absolute', top: '50%', left: '4%',
          width: 14, height: 14,
          background: 'rgba(232,75,58,0.7)',
          pointerEvents: 'none',
        }}
      />
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2.5 }}
        className="diamond-clip"
        style={{
          position: 'absolute', top: '55%', right: '7%',
          width: 18, height: 18,
          background: 'rgba(125,211,210,0.5)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Content ────────────────────────────────────────────────────── */}
      <div className="container mx-auto px-6 lg:px-12 relative" style={{ zIndex: 2 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: '4rem', textAlign: 'center' }}
        >
          <span className="section-eyebrow" style={{ marginBottom: 14, display: 'block' }}>
            {t('servicesSection.title.part1')}
          </span>
          <h2
            className="display-title"
            style={{ fontSize: 'clamp(2.8rem, 7.5vw, 6rem)', color: 'white', marginBottom: '1rem' }}
          >
            {t('servicesSection.title.part2')}
          </h2>
          <p style={{ color: 'var(--c-text-2)', maxWidth: 540, margin: '0 auto', lineHeight: 1.72, fontSize: '0.95rem' }}>
            {t('servicesSection.subtitle')}
          </p>
          {/* Decorative under-title diamond */}
          <div
            className="diamond-clip"
            style={{ width: 8, height: 8, background: 'var(--c-accent)', margin: '1.5rem auto 0' }}
          />
        </motion.div>

        {/* Cards row */}
        <div
          style={{
            display:   'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap:       '1.5rem',
          }}
        >
          {services.map((s, i) => (
            <ServiceCard
              key={i}
              service={s}
              index={i}
              number={String(i + 1).padStart(2, '0')}
              accent={ACCENTS[i]}
              onOpen={setOpenModal}
              learnMoreLabel={t('common.learnMore')}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ marginTop: '4rem', textAlign: 'center' }}
        >
          <p style={{ color: 'var(--c-text-2)', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
            {t('servicesSection.bottomCta.text')}
          </p>
          <button
            className="btn-primary"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            {t('servicesSection.bottomCta.button')}
            <ArrowRight size={14} />
          </button>
        </motion.div>
      </div>

      {/* ── Modal ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {openModal !== null && activeService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position:        'fixed',
              inset:           0,
              zIndex:          50,
              display:         'flex',
              alignItems:      'center',
              justifyContent:  'center',
              padding:         '1rem',
              backgroundColor: 'rgba(1,13,26,0.88)',
              backdropFilter:  'blur(6px)',
            }}
            onClick={() => setOpenModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 28 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit={{ opacity: 0,   scale: 0.93, y: 28 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              data-lenis-prevent
              className="modal-scroll"
              style={{
                maxWidth:    640,
                width:       '100%',
                maxHeight:   '90vh',
                overflowY:   'auto',
                background:  'var(--c-surface-2)',
                border:      '1px solid var(--c-border-2)',
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ borderBottom: '1px solid var(--c-border)', padding: '2rem', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: activeAccent }} />

                <button
                  onClick={() => setOpenModal(null)}
                  style={{
                    position:   'absolute', top: 14, right: 14,
                    width: 30, height: 30,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(255,255,255,0.06)',
                    border: 'none', cursor: 'pointer', color: 'var(--c-text-2)',
                  }}
                >
                  <X size={15} />
                </button>

                <div
                  className="diamond-clip"
                  style={{
                    width: 60, height: 60,
                    background: `linear-gradient(135deg, ${activeAccent}40 0%, ${activeAccent}cc 100%)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 16,
                  }}
                >
                  <activeService.icon size={24} color="white" />
                </div>

                <h3 className="display-title" style={{ fontSize: '2rem', color: 'white' }}>
                  {activeService.title}
                </h3>
                <p style={{ color: 'var(--c-text-2)', marginTop: 8, fontSize: '0.88rem' }}>
                  {t(`servicesSection.cards.${activeService.key}.expanded.tagline`)}
                </p>
              </div>

              <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <p style={{ color: 'var(--c-text-2)', lineHeight: 1.76, fontSize: '0.9rem' }}>
                  {t(`servicesSection.cards.${activeService.key}.expanded.pain`)}
                </p>

                <div style={{
                  background:  `${activeAccent}0d`,
                  borderLeft:  `3px solid ${activeAccent}`,
                  padding:     '1.1rem 1.25rem',
                }}>
                  <p style={{ color: 'rgba(255,255,255,0.82)', lineHeight: 1.72, fontSize: '0.88rem' }}>
                    {t(`servicesSection.cards.${activeService.key}.expanded.solution`)}
                  </p>
                </div>

                <div>
                  <h4 className="display-title" style={{ fontSize: '1.1rem', color: 'white', marginBottom: 14 }}>
                    {t(`servicesSection.cards.${activeService.key}.expanded.benefitsTitle`)}
                  </h4>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[0, 1, 2].map(i => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, color: 'var(--c-text-2)', fontSize: '0.88rem' }}>
                        <div className="diamond-clip" style={{ width: 10, height: 10, background: activeAccent, flexShrink: 0, marginTop: 4 }} />
                        {t(`servicesSection.cards.${activeService.key}.expanded.benefits.${i}`)}
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ borderLeft: `3px solid ${activeAccent}`, paddingLeft: '1rem', paddingTop: 4, paddingBottom: 4 }}>
                  <p style={{ color: activeAccent, fontWeight: 600, fontSize: '0.92rem' }}>
                    {t(`servicesSection.cards.${activeService.key}.expanded.result`)}
                  </p>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, paddingTop: 8 }}>
                  <button
                    className="btn-primary"
                    style={{ flex: 1, justifyContent: 'center' }}
                    onClick={() => {
                      setOpenModal(null);
                      setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 200);
                    }}
                  >
                    {t(`servicesSection.cards.${activeService.key}.expanded.cta`)}
                    <ArrowRight size={14} />
                  </button>
                  <button
                    className="btn-outline"
                    style={{ flex: 1, justifyContent: 'center' }}
                    onClick={() => setOpenModal(null)}
                  >
                    {t('common.close')}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Services;
