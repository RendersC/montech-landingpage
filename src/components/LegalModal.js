import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, FileText, UserCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ICONS = {
  privacy: Shield,
  offer: FileText,
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

  const Icon = ICONS[type] || FileText;
  const title = t(`legal.${type}.title`);
  const sections = t(`legal.${type}.sections`, { returnObjects: true }) || [];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 30 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-primary-50 to-purple-50 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-md">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow hover:bg-gray-50 transition-colors text-gray-500 hover:text-gray-800"
              aria-label="Закрыть"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="overflow-y-auto px-8 py-6 flex-1 text-gray-700 text-sm leading-relaxed space-y-5">
            <p className="text-xs text-gray-400 mb-4">{t(`legal.${type}.updatedAt`)}</p>
            {sections.map((section, i) => (
              <div key={i}>
                {section.heading && (
                  <h3 className="font-semibold text-gray-900 mb-1 text-base">{section.heading}</h3>
                )}
                {section.text && <p>{section.text}</p>}
                {section.list && (
                  <ul className="list-disc list-inside space-y-1 mt-2 text-gray-600">
                    {section.list.map((item, j) => <li key={j}>{item}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-8 py-4 border-t border-gray-100 shrink-0 flex justify-end bg-gray-50">
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

export default LegalModal;
