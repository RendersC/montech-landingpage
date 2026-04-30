import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import MagneticButton from './MagneticButton';

const LANGUAGES = [
  { code: 'ru', label: 'RU', full: 'Русский' },
  { code: 'en', label: 'EN', full: 'English' },
  { code: 'kk', label: 'KK', full: 'Қазақша' },
];

const Navbar = () => {
  const [isOpen,   setIsOpen]   = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const langRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  const navItems = [
    { key: 'services', label: t('nav.services') },
    { key: 'why-us',   label: t('nav.whyUs')    },
    { key: 'cases',    label: t('nav.cases')     },
    { key: 'reviews',  label: t('nav.reviews')   },
    { key: 'contact',  label: t('nav.contact')   },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position:   'fixed',
        top:        0,
        width:      '100%',
        zIndex:     50,
        transition: 'background 0.4s ease, box-shadow 0.4s ease',
        background: scrolled
          ? 'rgba(1, 13, 26, 0.92)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom:   scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
      }}
    >
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center py-5">

          {/* Logo */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            onClick={() => scrollTo('hero')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <span
              style={{
                fontFamily:    '"Barlow Condensed", sans-serif',
                fontWeight:    900,
                fontSize:      '1.5rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color:         'var(--c-accent)',
              }}
            >
              Steppe<span style={{ color: 'rgba(255,255,255,0.85)' }}>Dev</span>
            </span>
          </motion.button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map(item => (
              <motion.button
                key={item.key}
                onClick={() => scrollTo(item.key)}
                whileHover="hover"
                style={{
                  background:    'none',
                  border:        'none',
                  cursor:        'pointer',
                  fontFamily:    'Outfit, sans-serif',
                  fontSize:      '0.78rem',
                  fontWeight:    500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color:         'var(--c-text-2)',
                  transition:    'color 0.2s ease',
                  padding:       '4px 0',
                  position:      'relative',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--c-text)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--c-text-2)')}
              >
                {item.label}
                <motion.span
                  variants={{ hover: { scaleX: 1 }, initial: { scaleX: 0 } }}
                  initial="initial"
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    position:   'absolute',
                    left:       0,
                    bottom:     -4,
                    width:      '100%',
                    height:     1,
                    background: 'var(--c-accent)',
                    transformOrigin: 'left',
                  }}
                />
              </motion.button>
            ))}

            {/* Language picker */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                style={{
                  display:       'flex',
                  alignItems:    'center',
                  gap:           '4px',
                  background:    'rgba(255,255,255,0.05)',
                  border:        '1px solid var(--c-border-2)',
                  padding:       '5px 12px',
                  cursor:        'pointer',
                  fontFamily:    'Outfit, sans-serif',
                  fontSize:      '0.72rem',
                  fontWeight:    600,
                  letterSpacing: '0.12em',
                  color:         'var(--c-text-2)',
                  transition:    'all 0.2s ease',
                }}
              >
                {currentLang.label}
                <ChevronDown size={12} style={{ transform: langOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      position:   'absolute',
                      right:      0,
                      top:        '110%',
                      minWidth:   130,
                      background: 'var(--c-surface-2)',
                      border:     '1px solid var(--c-border-2)',
                      overflow:   'hidden',
                      zIndex:     60,
                    }}
                  >
                    {LANGUAGES.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => { i18n.changeLanguage(lang.code); setLangOpen(false); }}
                        style={{
                          display:    'flex',
                          alignItems: 'center',
                          gap:        10,
                          width:      '100%',
                          padding:    '9px 14px',
                          background: i18n.language === lang.code ? 'rgba(79,195,195,0.1)' : 'transparent',
                          border:     'none',
                          cursor:     'pointer',
                          fontFamily: 'Outfit, sans-serif',
                          fontSize:   '0.78rem',
                          color:      i18n.language === lang.code ? 'var(--c-accent)' : 'var(--c-text-2)',
                          transition: 'all 0.15s ease',
                          textAlign:  'left',
                        }}
                      >
                        <span style={{ fontWeight: 700, fontSize: '0.68rem', width: 20 }}>{lang.label}</span>
                        <span style={{ color: 'var(--c-text-3)' }}>{lang.full}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CTA */}
            <MagneticButton strength={14} className="btn-primary" onClick={() => scrollTo('contact')}>
              {t('getAQuote')}
            </MagneticButton>
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-text-2)' }}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                borderTop:  '1px solid var(--c-border)',
                overflow:   'hidden',
                background: 'rgba(1,13,26,0.98)',
              }}
            >
              <div className="py-6 space-y-1">
                {navItems.map(item => (
                  <button
                    key={item.key}
                    onClick={() => scrollTo(item.key)}
                    style={{
                      display:       'block',
                      width:         '100%',
                      textAlign:     'left',
                      padding:       '10px 0',
                      background:    'none',
                      border:        'none',
                      cursor:        'pointer',
                      fontFamily:    'Outfit, sans-serif',
                      fontSize:      '0.82rem',
                      fontWeight:    500,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color:         'var(--c-text-2)',
                    }}
                  >
                    {item.label}
                  </button>
                ))}

                <div className="pt-4 flex gap-2">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => i18n.changeLanguage(lang.code)}
                      style={{
                        flex:       1,
                        padding:    '8px',
                        background: i18n.language === lang.code ? 'rgba(79,195,195,0.15)' : 'rgba(255,255,255,0.04)',
                        border:     `1px solid ${i18n.language === lang.code ? 'rgba(79,195,195,0.4)' : 'var(--c-border)'}`,
                        cursor:     'pointer',
                        fontFamily: 'Outfit, sans-serif',
                        fontSize:   '0.72rem',
                        fontWeight: 700,
                        color:      i18n.language === lang.code ? 'var(--c-accent)' : 'var(--c-text-3)',
                        letterSpacing: '0.1em',
                      }}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>

                <div className="pt-3">
                  <button className="btn-primary w-full justify-center" onClick={() => scrollTo('contact')}>
                    {t('getAQuote')}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
