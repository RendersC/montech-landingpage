import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Bot, Globe, ArrowRight, X, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Services = () => {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(null);

  const services = [
    {
      icon: MessageCircle,
      key: 'chatbots',
      title: t('servicesSection.cards.chatbots.title'),
      description: t('servicesSection.cards.chatbots.description'),
      features: [t('servicesSection.cards.chatbots.features.0'), t('servicesSection.cards.chatbots.features.1'), t('servicesSection.cards.chatbots.features.2'), t('servicesSection.cards.chatbots.features.3')]
    },
    {
      icon: Bot,
      key: 'ai',
      title: t('servicesSection.cards.ai.title'),
      description: t('servicesSection.cards.ai.description'),
      features: [t('servicesSection.cards.ai.features.0'), t('servicesSection.cards.ai.features.1'), t('servicesSection.cards.ai.features.2'), t('servicesSection.cards.ai.features.3')]
    },
    {
      icon: Globe,
      key: 'landing',
      title: t('servicesSection.cards.landing.title'),
      description: t('servicesSection.cards.landing.description'),
      features: [t('servicesSection.cards.landing.features.0'), t('servicesSection.cards.landing.features.1'), t('servicesSection.cards.landing.features.2'), t('servicesSection.cards.landing.features.3')]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const activeService = openModal !== null ? services[openModal] : null;

  return (
    <section id="services" className="py-20 bg-white">
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
            {t('servicesSection.title.part1')} <span className="gradient-text">{t('servicesSection.title.part2')}</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('servicesSection.subtitle')}
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -10 }}
              className="card p-8 group cursor-pointer"
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <service.icon className="text-white" size={32} />
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                {service.description}
              </p>

              {/* Features */}
              <ul className="space-y-2 mb-6">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Learn More Button */}
              <motion.button
                whileHover={{ x: 5 }}
                onClick={() => setOpenModal(index)}
                className="flex items-center text-primary-600 font-semibold group-hover:text-primary-700 transition-colors duration-200"
              >
                {t('common.learnMore')}
                <ArrowRight className="ml-2" size={16} />
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <p className="text-lg text-gray-600 mb-6">
            {t('servicesSection.bottomCta.text')}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const element = document.getElementById('contact');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            className="btn-primary"
          >
            {t('servicesSection.bottomCta.button')}
          </motion.button>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {openModal !== null && activeService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
            onClick={() => setOpenModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-primary-500 to-purple-600 rounded-t-2xl p-8 relative">
                <button
                  onClick={() => setOpenModal(null)}
                  className="absolute top-4 right-4 w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
                >
                  <X className="text-white" size={18} />
                </button>
                <div className="w-14 h-14 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mb-4">
                  <activeService.icon className="text-white" size={28} />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">
                  {activeService.title}
                </h3>
                <p className="text-white text-opacity-90 text-lg">
                  {t(`servicesSection.cards.${activeService.key}.expanded.tagline`)}
                </p>
              </div>

              {/* Modal Body */}
              <div className="p-8 space-y-6">
                {/* Pain point */}
                <div>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {t(`servicesSection.cards.${activeService.key}.expanded.pain`)}
                  </p>
                </div>

                {/* Solution */}
                <div className="bg-gray-50 rounded-xl p-5">
                  <p className="text-gray-800 leading-relaxed font-medium">
                    {t(`servicesSection.cards.${activeService.key}.expanded.solution`)}
                  </p>
                </div>

                {/* Benefits */}
                <div>
                  <h4 className="font-bold text-gray-900 text-lg mb-4">
                    {t(`servicesSection.cards.${activeService.key}.expanded.benefitsTitle`)}
                  </h4>
                  <ul className="space-y-3">
                    {[0, 1, 2].map((i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="text-primary-500 mt-0.5 flex-shrink-0" size={20} />
                        <span className="text-gray-700">
                          {t(`servicesSection.cards.${activeService.key}.expanded.benefits.${i}`)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Result highlight */}
                <div className="border-l-4 border-primary-500 pl-4 py-2">
                  <p className="text-primary-700 font-semibold text-lg">
                    {t(`servicesSection.cards.${activeService.key}.expanded.result`)}
                  </p>
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setOpenModal(null);
                      setTimeout(() => {
                        const el = document.getElementById('contact');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }, 200);
                    }}
                    className="btn-primary flex-1 text-center"
                  >
                    {t(`servicesSection.cards.${activeService.key}.expanded.cta`)}
                  </motion.button>
                  <button
                    onClick={() => setOpenModal(null)}
                    className="flex-1 border-2 border-gray-200 rounded-lg px-6 py-3 text-gray-600 font-semibold hover:border-gray-300 transition-colors"
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
