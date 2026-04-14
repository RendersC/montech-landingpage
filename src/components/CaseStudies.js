import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Clock, X, ChevronLeft, ChevronRight, Play, ZoomIn } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { databases, DATABASE_ID, CASES_COLLECTION_ID } from '../config/appwrite';
import { Query } from 'appwrite';

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=2070&q=80',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2070&q=80',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=2015&q=80',
];

// ── Case Detail Modal ─────────────────────────────────────────────────────────
const CaseModal = ({ caseData, onClose }) => {
  const { t } = useTranslation();
  const [mediaIndex, setMediaIndex] = useState(0);

  const media  = caseData.media  || [];  // [{url, type}]

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const esc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', esc);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', esc); };
  }, [onClose]);

  const prev = useCallback(() => setMediaIndex(i => (i - 1 + media.length) % media.length), [media.length]);
  const next = useCallback(() => setMediaIndex(i => (i + 1) % media.length), [media.length]);

  const current = media[mediaIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 30 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-start justify-between px-8 py-5 border-b border-gray-100 shrink-0">
            <div>
              <span className="inline-block bg-primary-100 text-primary-700 text-xs font-semibold px-3 py-1 rounded-full mb-2">
                {caseData.category}
              </span>
              <h2 className="text-2xl font-bold text-gray-900">{caseData.title}</h2>
              {caseData.company && <p className="text-sm text-primary-600 font-medium mt-1">{caseData.company}</p>}
            </div>
            <button
              onClick={onClose}
              className="ml-4 mt-1 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-500 hover:text-gray-800 shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="overflow-y-auto flex-1">
            {/* Media Gallery */}
            {media.length > 0 && (
              <div className="relative bg-black">
                <div className="relative flex items-center justify-center" style={{ minHeight: '320px', maxHeight: '420px' }}>
                  {current?.type === 'video' ? (
                    <video
                      key={current.url}
                      src={current.url}
                      controls
                      className="w-full max-h-96 object-contain"
                    />
                  ) : (
                    <img
                      key={current?.url}
                      src={current?.url}
                      alt={`Media ${mediaIndex + 1}`}
                      className="w-full max-h-96 object-contain"
                    />
                  )}

                  {media.length > 1 && (
                    <>
                      <button
                        onClick={prev}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={next}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
                        {mediaIndex + 1} / {media.length}
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {media.length > 1 && (
                  <div className="flex gap-2 px-4 py-3 overflow-x-auto">
                    {media.map((m, i) => (
                      <button
                        key={i}
                        onClick={() => setMediaIndex(i)}
                        className={`relative shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          i === mediaIndex ? 'border-primary-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        {m.type === 'video' ? (
                          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                            <Play className="w-5 h-5 text-white" />
                          </div>
                        ) : (
                          <img src={m.url} alt="" className="w-full h-full object-cover" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Content */}
            <div className="px-8 py-6 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Описание</h3>
                <p className="text-gray-700 leading-relaxed">{caseData.description}</p>
              </div>

              {/* Results */}
              {caseData.results && caseData.results.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Результаты</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {caseData.results.map((r, i) => (
                      <div key={i} className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-xl p-4 flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        <span className="text-sm text-gray-700 font-medium">{r}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 border-t border-gray-100 shrink-0 bg-gray-50 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-purple-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow"
            >
              {t('common.close')}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ── CaseStudies Section ───────────────────────────────────────────────────────
const CaseStudies = () => {
  const { t } = useTranslation();
  const [cases, setCases]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null); // opened case for modal

  useEffect(() => {
    const loadCases = async () => {
      if (!CASES_COLLECTION_ID || !DATABASE_ID) { setCases([]); setLoading(false); return; }
      try {
        const res = await databases.listDocuments(DATABASE_ID, CASES_COLLECTION_ID, [
          Query.orderDesc('$createdAt'),
          Query.limit(20),
        ]);
        const dynamic = res.documents.map((doc, i) => {
          let mediaUrls  = [];
          let mediaTypes = [];
          try { mediaUrls  = JSON.parse(doc.mediaUrls  || '[]'); } catch {}
          try { mediaTypes = JSON.parse(doc.mediaTypes || '[]'); } catch {}
          const media = mediaUrls.map((url, j) => ({ url, type: mediaTypes[j] || 'photo' }));

          return {
            id:          doc.$id,
            title:       doc.caseTitle,
            company:     doc.company || '',
            description: doc.caseDescription,
            image:       doc.coverUrl || DEFAULT_IMAGES[i % 3],
            results:     [doc.outcome0, doc.outcome1, doc.outcome2].filter(Boolean),
            category:    doc.category,
            media,
          };
        });
        setCases(dynamic);
      } catch {
        setCases([]);
      } finally {
        setLoading(false);
      }
    };
    loadCases();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3, delayChildren: 0.1 } },
  };
  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <section id="cases" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('cases.title.part1')} <span className="gradient-text">{t('cases.title.part2')}</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t('cases.subtitle')}</p>
        </motion.div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[0, 1, 2].map((i) => (
              <div key={i} className="card overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && cases !== null && cases.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-100 to-purple-100 flex items-center justify-center mb-6 shadow-inner">
              <Clock className="w-10 h-10 text-primary-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">{t('cases.comingSoon.title')}</h3>
            <p className="text-gray-500 max-w-md">{t('cases.comingSoon.text')}</p>
          </motion.div>
        )}

        {/* Cases Grid */}
        {!loading && cases && cases.length > 0 && (
          <motion.div
            variants={containerVariants} initial="hidden"
            whileInView="visible" viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {cases.map((study, index) => (
              <motion.div
                key={study.id || index}
                variants={cardVariants}
                whileHover={{ y: -10 }}
                className="card overflow-hidden group cursor-pointer"
                onClick={() => setSelected(study)}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={study.image}
                    alt={study.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {study.category}
                    </span>
                  </div>
                  {study.media.length > 0 && (
                    <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <ZoomIn className="w-3 h-3" />
                      {study.media.length}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  {study.company && (
                    <p className="text-sm text-primary-600 font-semibold mb-2">{study.company}</p>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors duration-200">
                    {study.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed line-clamp-2">{study.description}</p>
                  <div className="space-y-2 mb-4">
                    {study.results.map((result, ri) => (
                      <div key={ri} className="flex items-center text-sm text-gray-600">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {result}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center text-primary-600 font-semibold text-sm group-hover:text-primary-700 transition-colors">
                    {t('cases.viewButton')}
                    <ZoomIn className="ml-2 w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-lg text-gray-600 mb-6">{t('cases.bottomCta.text')}</p>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => { document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="btn-primary"
          >
            {t('cases.bottomCta.button')}
          </motion.button>
        </motion.div>
      </div>

      {/* Case Detail Modal */}
      {selected && <CaseModal caseData={selected} onClose={() => setSelected(null)} />}
    </section>
  );
};

export default CaseStudies;
