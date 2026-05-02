import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, FileText, UserCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ICONS = {
  privacy: Shield,
  offer:   FileText,
  consent: UserCheck,
};

const LegalModal = ({ type, onClose }) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (!type) return;
    document.body.style.overflow = 'hidden';
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [type, onClose]);

  if (!type) return null;

  const Icon    = ICONS[type] || FileText;
  const title   = t(`legal.${type}.title`);
  const sections = t(`legal.${type}.sections`, { returnObjects: true }) || [];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(1,13,26,0.88)', backdropFilter: 'blur(6px)' }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 28 }}
          animate={{ opacity: 1, scale: 1,    y: 0  }}
          exit={{ opacity: 0,   scale: 0.93, y: 28 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{
            background:  'var(--c-surface-2)',
            border:      '1px solid var(--c-border-2)',
            borderRadius: 2,
            width:       '100%',
            maxWidth:    600,
            maxHeight:   '85vh',
            display:     'flex',
            flexDirection: 'column',
            overflow:    'hidden',
          }}
        >
          {/* Header */}
          <div style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
            padding:        '1.5rem 2rem',
            borderBottom:   '1px solid var(--c-border)',
            flexShrink:     0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                className="diamond-clip"
                style={{
                  width:      40,
                  height:     40,
                  background: 'linear-gradient(135deg, var(--c-steel), var(--c-teal))',
                  display:    'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={18} color="white" />
              </div>
              <h2
                className="display-title"
                style={{ fontSize: '1.4rem', color: 'white' }}
              >
                {title}
              </h2>
            </div>
            <button
              onClick={onClose}
              style={{
                width:      30,
                height:     30,
                display:    'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255,255,255,0.06)',
                border:     'none',
                cursor:     'pointer',
                color:      'var(--c-text-2)',
              }}
              aria-label="Закрыть"
            >
              <X size={15} />
            </button>
          </div>

          {/* Body */}
          <div
            data-lenis-prevent
            className="modal-scroll"
            style={{
              overflowY:   'auto',
              padding:     '1.5rem 2rem',
              flex:        1,
              color:       'var(--c-text-2)',
              fontSize:    '0.86rem',
              lineHeight:  1.75,
              display:     'flex',
              flexDirection: 'column',
              gap:         '1.25rem',
            }}
          >
            <p style={{ fontSize: '0.72rem', color: 'var(--c-text-3)', letterSpacing: '0.06em' }}>
              {t(`legal.${type}.updatedAt`)}
            </p>
            {sections.map((section, i) => (
              <div key={i}>
                {section.heading && (
                  <h3
                    className="display-title"
                    style={{ fontSize: '1rem', color: 'white', marginBottom: 8 }}
                  >
                    {section.heading}
                  </h3>
                )}
                {section.text && <p>{section.text}</p>}
                {section.list && (
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                    {section.list.map((item, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <div
                          className="diamond-clip"
                          style={{ width: 7, height: 7, background: 'var(--c-accent)', flexShrink: 0, marginTop: 6 }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{
            padding:      '1rem 2rem',
            borderTop:    '1px solid var(--c-border)',
            flexShrink:   0,
            display:      'flex',
            justifyContent: 'flex-end',
            background:   'rgba(255,255,255,0.02)',
          }}>
            <button className="btn-primary" onClick={onClose}>
              {t('common.close')}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LegalModal;
