import React, { useState } from 'react';
import Hero from './components/Hero';
import Services from './components/Services';
import WhyChooseUs from './components/WhyChooseUs';
import CaseStudies from './components/CaseStudies';
import Testimonials from './components/Testimonials';
import CallToAction from './components/CallToAction';
import Contact from './components/Contact';
import Navbar from './components/Navbar';
import LegalModal from './components/LegalModal';
import SmoothScroll from './components/SmoothScroll';
import TechMarquee from './components/TechMarquee';
import ChatBot from './components/ChatBot';
import { useTranslation } from 'react-i18next';

function App() {
  const { t } = useTranslation();
  const [legalModal, setLegalModal] = useState(null); // 'privacy' | 'offer' | 'consent' | null

  return (
    <SmoothScroll>
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--c-bg)' }}>
      <Navbar />
      <main>
        <Hero />
        <TechMarquee />
        <Services />
        <WhyChooseUs />
        <CaseStudies />
        <Testimonials />
        <CallToAction />
        <Contact onOpenLegal={setLegalModal} />
      </main>

      <footer style={{ background: 'var(--c-bg)', borderTop: '1px solid var(--c-border)', padding: '2.5rem 0' }}>
        <div className="container mx-auto px-6 lg:px-12" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          {/* Logo */}
          <span style={{ fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 900, fontSize: '1.15rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--c-accent)' }}>
            Steppe<span style={{ color: 'rgba(255,255,255,0.6)' }}>Dev</span>
          </span>
          {/* Copyright */}
          <p style={{ color: 'var(--c-text-3)', fontSize: '0.75rem', letterSpacing: '0.06em' }}>
            {t('footer.copyright')}
          </p>
          {/* Legal links */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
            {[
              { key: 'privacy', label: t('legal.privacy.linkTitle') },
              { key: 'offer',   label: t('legal.offer.linkTitle')   },
              { key: 'consent', label: t('legal.consent.linkTitle') },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setLegalModal(key)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-text-3)', fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'color 0.2s ease' }}
                onMouseEnter={e => (e.target.style.color = 'var(--c-text-2)')}
                onMouseLeave={e => (e.target.style.color = 'var(--c-text-3)')}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </footer>

      <LegalModal type={legalModal} onClose={() => setLegalModal(null)} />
      <ChatBot />
    </div>
    </SmoothScroll>
  );
}

export default App;
