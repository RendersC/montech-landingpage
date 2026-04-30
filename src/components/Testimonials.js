import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { databases, DATABASE_ID, REVIEWS_COLLECTION_ID } from '../config/appwrite';
import { Query } from 'appwrite';

// ── Source badge config ──────────────────────────────────────────────────────
const SOURCE_CONFIG = {
  Kwork:     { label: 'Kwork',     bg: 'bg-green-500',   letter: 'K' },
  Upwork:    { label: 'Upwork',    bg: 'bg-green-700',   letter: 'U' },
  Instagram: { label: 'Instagram', bg: 'bg-gradient-to-br from-pink-500 to-purple-600', letter: '📸' },
  'Жизнь':     { label: 'Global',     bg: 'bg-blue-500',    letter: '🌐' },
  Другое:    { label: 'Global',     bg: 'bg-gray-500',    letter: '🌐' },
};

const kworkReviews = [
  {
    username: 'm-uchet',
    project: 'Web DEV',
    source: 'Kwork',
    content: 'Благодарю исполнителя за выполненную работу! Заказ по верстке был выполнен раньше оговоренного срока, все правки учли и моментально исправили, ребята профи — всем рекомендую!',
    rating: 5,
    initials: 'M',
    color: 'from-blue-500 to-blue-600',
  },
  {
    username: 'pulsar197',
    project: 'Script',
    source: 'Kwork',
    content: 'Задача была выполнена сверх оперативно! Очень рекомендую данного исполнителя. Сам буду обращаться к нему еще.',
    rating: 5,
    initials: 'P',
    color: 'from-orange-400 to-orange-500',
  },
  {
    username: 'kuzhbalov96',
    project: 'Разработка Telegram-бота на Alogram с PostgreSQL',
    source: 'Kwork',
    content: 'Отличная работа! Исполнитель SteppeDev проявил себя как настоящий профессионал. Задача по разработке Telegram-бота была выполнена качественно и в соответствии с ТЗ. Все ключевые функции, включая управление ролями и систему квот, реализованы безупречно.',
    rating: 5,
    initials: 'K',
    color: 'from-green-500 to-green-600',
  },
  {
    username: 'vladimirkotaev8',
    project: 'Скрипт',
    source: 'Kwork',
    content: 'Ребята выполнили работу в кратчайшие сроки, спасибо им большое! Отвечают очень быстро из-за чего очень просто коммуницировать и работа, в следствие чего идет очень быстро. Советую!',
    rating: 5,
    initials: 'V',
    color: 'from-purple-500 to-purple-600',
  },
  {
    username: 'pkdcfwvn48',
    project: 'Разработка корпоративного сайта',
    content: 'Я осталась очень довольна работой, сайт хороший, приятный глазу. Сделали очень шустро, четко и без каких-то проблем, понимают с полуслова и понимают что хочет заказчик. Буду ли я обращаться снова? ОДНОЗНАЧНО ДА!',
    rating: 5,
    initials: 'P',
    color: 'from-pink-500 to-pink-600',
  },
  {
    username: 'art36',
    project: 'Скрипт',
    content: 'Делал правку скрипта на Python — в отличии от многих других сделал все быстро и качественно.',
    rating: 5,
    initials: 'A',
    color: 'from-teal-500 to-teal-600',
  },
];

const Testimonials = () => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviews, setReviews] = useState(kworkReviews);

  // Load dynamic reviews from Appwrite (bot-uploaded), merge with Kwork reviews
  useEffect(() => {
    const loadReviews = async () => {
      if (!REVIEWS_COLLECTION_ID || !DATABASE_ID) return;
      try {
        const res = await databases.listDocuments(DATABASE_ID, REVIEWS_COLLECTION_ID, [
          Query.orderDesc('$createdAt'),
          Query.limit(20),
        ]);
        if (res.documents.length > 0) {
          const dynamic = res.documents.map((doc) => ({
            username: doc.reviewerUsername,
            project:  doc.relatedProject,
            content:  doc.reviewContent,
            rating:   doc.reviewRating || 5,
            source:   doc.source || 'Kwork',
            initials: (doc.reviewerUsername || 'U')[0].toUpperCase(),
            color:    'from-primary-500 to-purple-600',
          }));
          setReviews([...dynamic, ...kworkReviews]);
        }
      } catch (err) {
        console.error('[Testimonials] Appwrite load failed:', err);
      }
    };
    loadReviews();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % kworkReviews.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + kworkReviews.length) % kworkReviews.length);
  };

  const review = reviews[currentIndex] || reviews[0];

  return (
    <section id="reviews" style={{ background: 'var(--c-bg)', padding: '5rem 0' }}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="display-title text-white mb-6" style={{ fontSize: 'clamp(2.4rem, 6vw, 4.5rem)' }}>
            {t('reviews.title.part1')} <span className="gradient-text">{t('reviews.title.part2')}</span>
          </h2>
          <p className="text-lg max-w-3xl mx-auto" style={{ color: 'var(--c-text-2)' }}>
            {t('reviews.subtitle')}
          </p>

          {/* Platform badges */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {[
              { bg: 'from-green-400 to-green-500', letter: 'K', label: 'Kwork' },
              { bg: 'from-green-600 to-green-700', letter: 'U', label: 'Upwork' },
              { bg: 'from-pink-500 to-purple-600', letter: '📸', label: 'Instagram' },
              { bg: 'from-blue-400 to-blue-600',   letter: '🌐', label: 'Global' },
            ].map((p) => (
              <div key={p.label} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${p.bg} flex items-center justify-center shrink-0`}>
                  <span className="text-white text-[9px] font-bold leading-none">{p.letter}</span>
                </div>
                <span className="text-xs font-medium" style={{ color: 'var(--c-text-2)' }}>{p.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="max-w-4xl mx-auto relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 md:-left-6 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center transition-colors duration-200"
            style={{ background: 'var(--c-surface-2)', border: '1px solid var(--c-border-2)', borderRadius: 0 }}
          >
            <ChevronLeft size={22} style={{ color: 'var(--c-text-2)' }} />
          </button>

          <button
            onClick={nextTestimonial}
            className="absolute right-0 md:-right-6 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center transition-colors duration-200"
            style={{ background: 'var(--c-surface-2)', border: '1px solid var(--c-border-2)', borderRadius: 0 }}
          >
            <ChevronRight size={22} style={{ color: 'var(--c-text-2)' }} />
          </button>

          {/* Testimonial Content */}
          <div className="relative overflow-hidden px-6 md:px-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="dark-card p-8 md:p-12"
              >
                {/* Project type label */}
                <div className="flex justify-center mb-6">
                  <span className="text-sm font-semibold px-4 py-1.5" style={{ background: 'rgba(79,195,195,0.1)', color: 'var(--c-accent)', border: '1px solid rgba(79,195,195,0.2)' }}>
                    {review.project}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex justify-center mb-6 gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-lg md:text-xl text-center mb-8 leading-relaxed" style={{ color: 'var(--c-text-2)' }}>
                  «{review.content}»
                </p>

                {/* Author */}
                <div className="flex items-center justify-center gap-4">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${review.color} flex items-center justify-center text-white text-xl font-bold flex-shrink-0`}>
                    {review.initials}
                  </div>
                  <div>
                    <h4 className="font-bold" style={{ color: 'white' }}>@{review.username}</h4>
                    {/* Source Badge */}
                    <div className="flex items-center gap-1.5 mt-1">
                      {(() => {
                        const src = SOURCE_CONFIG[review.source] || SOURCE_CONFIG['Kwork'];
                        const isEmoji = src.letter.length > 1;
                        return (
                          <>
                            <div className={`w-4 h-4 rounded-full ${src.bg} flex items-center justify-center shrink-0`}>
                              {isEmoji
                                ? <span className="text-[9px]">{src.letter}</span>
                                : <span className="text-white text-[9px] font-bold">{src.letter}</span>
                              }
                            </div>
                            <span className="text-sm" style={{ color: 'var(--c-text-3)' }}>{src.label} · {t('reviews.verifiedBuyer')}</span>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 gap-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                style={{
                  height: 3, width: index === currentIndex ? 24 : 6,
                  background: index === currentIndex ? 'var(--c-accent)' : 'rgba(255,255,255,0.15)',
                  border: 'none', cursor: 'pointer', transition: 'all 0.3s ease',
                  padding: 0,
                }}
              />
            ))}
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-px text-center" style={{ background: 'var(--c-border)' }}
        >
          {[
            { val: '98%',   key: 'satisfaction' },
            { val: '5.0/5', key: 'average'      },
            { val: '50+',   key: 'clients'      },
            { val: '100%',  key: 'success'      },
          ].map(({ val, key }) => (
            <div key={key} style={{ background: 'var(--c-surface)', padding: '1.5rem' }}>
              <div className="display-title gradient-text" style={{ fontSize: '2.2rem', marginBottom: 6 }}>{val}</div>
              <div style={{ color: 'var(--c-text-3)', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{t(`reviews.stats.${key}`)}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
