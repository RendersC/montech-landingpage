import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { databases, DATABASE_ID, REVIEWS_COLLECTION_ID } from '../config/appwrite';
import { Query } from 'appwrite';

// ── Source badge config ──────────────────────────────────────────────────────
const SOURCE_CONFIG = {
  Kwork:     { label: 'Kwork',     bg: 'bg-green-500',  letter: 'K', color: 'text-white' },
  Upwork:    { label: 'Upwork',    bg: 'bg-green-700',  letter: 'U', color: 'text-white' },
  Instagram: { label: 'Instagram', bg: 'bg-gradient-to-br from-pink-500 to-purple-600', letter: '📸', color: 'text-white' },
  'Жизнь':     { label: 'Реальный клиент', bg: 'bg-blue-500', letter: '🤝', color: 'text-white' },
  Другое:    { label: 'Отзыв',       bg: 'bg-gray-500',  letter: '💬', color: 'text-white' },
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
    content: 'Отличная работа! Исполнитель Montech проявил себя как настоящий профессионал. Задача по разработке Telegram-бота была выполнена качественно и в соответствии с ТЗ. Все ключевые функции, включая управление ролями и систему квот, реализованы безупречно.',
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
    <section id="reviews" className="py-20 gradient-bg">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('reviews.title.part1')} <span className="gradient-text">{t('reviews.title.part2')}</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('reviews.subtitle')}
          </p>

          {/* Kwork badge */}
          <div className="mt-6 inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm">
            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-green-400 to-green-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">K</span>
            </div>
            <span className="text-sm font-medium text-gray-700">{t('reviews.kworkBadge')}</span>
            <ExternalLink size={13} className="text-gray-400" />
          </div>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="max-w-4xl mx-auto relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 md:-left-6 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
          >
            <ChevronLeft className="text-gray-600" size={24} />
          </button>

          <button
            onClick={nextTestimonial}
            className="absolute right-0 md:-right-6 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
          >
            <ChevronRight className="text-gray-600" size={24} />
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
                className="bg-white rounded-2xl p-8 md:p-12 shadow-xl"
              >
                {/* Project type label */}
                <div className="flex justify-center mb-6">
                  <span className="bg-primary-50 text-primary-700 text-sm font-semibold px-4 py-1.5 rounded-full border border-primary-100">
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
                <p className="text-lg md:text-xl text-gray-700 text-center mb-8 leading-relaxed">
                  «{review.content}»
                </p>

                {/* Author */}
                <div className="flex items-center justify-center gap-4">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${review.color} flex items-center justify-center text-white text-xl font-bold flex-shrink-0`}>
                    {review.initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">@{review.username}</h4>
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
                            <span className="text-sm text-gray-500">{src.label} · {t('reviews.verifiedBuyer')}</span>
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
                className={`h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-primary-600 w-8'
                    : 'bg-gray-300 hover:bg-gray-400 w-3'
                }`}
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
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          <div className="space-y-2">
            <div className="text-3xl md:text-4xl font-bold gradient-text">98%</div>
            <div className="text-gray-600 font-medium">{t('reviews.stats.satisfaction')}</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl md:text-4xl font-bold gradient-text">5.0/5</div>
            <div className="text-gray-600 font-medium">{t('reviews.stats.average')}</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl md:text-4xl font-bold gradient-text">50+</div>
            <div className="text-gray-600 font-medium">{t('reviews.stats.clients')}</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl md:text-4xl font-bold gradient-text">100%</div>
            <div className="text-gray-600 font-medium">{t('reviews.stats.success')}</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
