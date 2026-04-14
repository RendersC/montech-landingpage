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
import { useTranslation } from 'react-i18next';

function App() {
  const { t } = useTranslation();
  const [legalModal, setLegalModal] = useState(null); // 'privacy' | 'offer' | 'consent' | null

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <WhyChooseUs />
        <CaseStudies />
        <Testimonials />
        <CallToAction />
        <Contact onOpenLegal={setLegalModal} />
      </main>

      <footer className="bg-gray-900 text-white py-10">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-4 text-gray-400 text-sm">{t('footer.copyright')}</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            <button
              onClick={() => setLegalModal('privacy')}
              className="text-gray-400 hover:text-white transition-colors underline-offset-2 hover:underline"
            >
              {t('legal.privacy.linkTitle')}
            </button>
            <button
              onClick={() => setLegalModal('offer')}
              className="text-gray-400 hover:text-white transition-colors underline-offset-2 hover:underline"
            >
              {t('legal.offer.linkTitle')}
            </button>
            <button
              onClick={() => setLegalModal('consent')}
              className="text-gray-400 hover:text-white transition-colors underline-offset-2 hover:underline"
            >
              {t('legal.consent.linkTitle')}
            </button>
          </div>
        </div>
      </footer>

      <LegalModal type={legalModal} onClose={() => setLegalModal(null)} />
    </div>
  );
}

export default App;
