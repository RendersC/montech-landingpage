import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MessageCircle, Phone, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { databases, CONTACT_COLLECTION_ID, DATABASE_ID } from '../config/appwrite';
import { ID } from 'appwrite';
import { useTranslation } from 'react-i18next';

/* ── Input + Textarea shared styles ───────────────────────────────────────── */
const inputStyle = {
  width:          '100%',
  padding:        '12px 16px',
  background:     'rgba(255,255,255,0.04)',
  border:         '1px solid rgba(255,255,255,0.1)',
  color:          'white',
  fontFamily:     'Outfit, sans-serif',
  fontSize:       '0.9rem',
  outline:        'none',
  transition:     'border-color 0.25s ease',
};

const labelStyle = {
  display:       'block',
  marginBottom:  6,
  fontSize:      '0.72rem',
  fontWeight:    500,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color:         'var(--c-text-3)',
};

const Contact = ({ onOpenLegal }) => {
  const { t } = useTranslation();
  const [formData,       setFormData]       = useState({ name: '', email: '', message: '' });
  const [isSubmitting,   setIsSubmitting]   = useState(false);
  const [submitStatus,   setSubmitStatus]   = useState(null);
  const [submittedName,  setSubmittedName]  = useState('');
  const [consentChecked, setConsentChecked] = useState(false);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const sendToTelegram = async (name, email, message) => {
    const BOT_TOKEN = '8631734357:AAEWTyh_iE5zc4N-TVL-1sAgXwHd_dVSpps';
    const CHAT_ID   = '1555289492';
    const text = `🔔 *Новая заявка с сайта SteppeDev*\n\n👤 *Имя:* ${name}\n📧 *Email:* ${email}\n\n💬 *Сообщение:*\n${message}`;
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'Markdown' }),
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      await databases.createDocument(DATABASE_ID, CONTACT_COLLECTION_ID, ID.unique(), {
        name:    formData.name,
        email:   formData.email,
        message: formData.message,
      });
      await sendToTelegram(formData.name, formData.email, formData.message);
      setSubmitStatus('success');
      setSubmittedName(formData.name);
      setFormData({ name: '', email: '', message: '' });
    } catch {
      try {
        await sendToTelegram(formData.name, formData.email, formData.message);
        setSubmitStatus('success');
        setSubmittedName(formData.name);
        setFormData({ name: '', email: '', message: '' });
      } catch {
        setSubmitStatus('error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const openTelegram  = () => window.open('https://t.me/sdpazdacha', '_blank');
  const openWhatsApp  = () => window.open('https://wa.me/77086570811?text=Привет%20SteppeDev,%20я%20хотел%20бы%20обсудить%20проект.', '_blank');
  const openEmail     = () => window.open('mailto:steppedev@gmail.com?subject=Project%20Inquiry', '_blank');

  /* ── Channel button ──────────────────────────────────────────────────────── */
  const ChannelBtn = ({ onClick, icon: Icon, label, bg }) => (
    <motion.button
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        display:     'flex',
        alignItems:  'center',
        gap:         12,
        width:       '100%',
        padding:     '14px 18px',
        background:  'transparent',
        border:      '1px solid var(--c-border-2)',
        cursor:      'pointer',
        transition:  'all 0.25s ease',
        color:       'var(--c-text-2)',
        fontFamily:  'Outfit, sans-serif',
        fontSize:    '0.85rem',
        fontWeight:  500,
        position:    'relative',
        overflow:    'hidden',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(79,195,195,0.35)'; e.currentTarget.style.color = 'white'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--c-border-2)';     e.currentTarget.style.color = 'var(--c-text-2)'; }}
    >
      <div
        className="diamond-clip"
        style={{ width: 34, height: 34, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
      >
        <Icon size={15} color="white" />
      </div>
      {label}
      <ArrowRight size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />
    </motion.button>
  );

  return (
    <section id="contact" style={{ background: 'var(--c-bg)', padding: '6rem 0', position: 'relative' }}>
      {/* Corner diamond decoration */}
      <div
        className="diamond-clip"
        style={{
          position:   'absolute',
          top:        -80,
          left:       -80,
          width:      260,
          height:     260,
          background: 'radial-gradient(circle, rgba(38,80,119,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container mx-auto px-6 lg:px-12 relative" style={{ zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: '3.5rem' }}
        >
          <span className="section-eyebrow" style={{ marginBottom: 12 }}>
            {t('contact.title.part1')}
          </span>
          <h2
            className="display-title"
            style={{ fontSize: 'clamp(2.6rem, 6.5vw, 5rem)', color: 'white', maxWidth: 560 }}
          >
            {t('contact.title.part2')}
          </h2>
          <p style={{ color: 'var(--c-text-2)', marginTop: '1.2rem', maxWidth: 480, lineHeight: 1.72, fontSize: '0.9rem' }}>
            {t('contact.subtitle')}
          </p>
        </motion.div>

        {/* Two-column grid with gap-px separator */}
        <div
          style={{
            display:   'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap:       1,
            background: 'var(--c-border)',
          }}
        >
          {/* ── Left: channels + benefits ─────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ background: 'var(--c-surface)', padding: '2.5rem' }}
          >
            <h3
              className="display-title"
              style={{ fontSize: '1.5rem', color: 'white', marginBottom: '1.5rem' }}
            >
              {t('contact.left.title')}
            </h3>
            <p style={{ color: 'var(--c-text-2)', marginBottom: '2rem', lineHeight: 1.72, fontSize: '0.88rem' }}>
              {t('contact.left.text')}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: '2rem' }}>
              <ChannelBtn onClick={openTelegram} icon={MessageCircle} label={t('contact.methods.telegram')} bg="rgba(38,136,218,0.7)" />
              <ChannelBtn onClick={openWhatsApp} icon={Phone}         label={t('contact.methods.whatsapp')} bg="rgba(37,211,102,0.7)" />
              <ChannelBtn onClick={openEmail}    icon={Mail}          label={t('contact.methods.email')}    bg="rgba(79,195,195,0.6)" />
            </div>

            {/* Why box */}
            <div style={{ background: 'rgba(79,195,195,0.04)', border: '1px solid rgba(79,195,195,0.1)', padding: '1.25rem' }}>
              <h4
                className="display-title"
                style={{ fontSize: '1rem', color: 'white', marginBottom: 12 }}
              >
                {t('contact.why.title')}
              </h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {[0, 1, 2, 3].map(i => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, color: 'var(--c-text-2)', fontSize: '0.82rem' }}>
                    <div className="diamond-clip" style={{ width: 8, height: 8, background: 'var(--c-accent)', flexShrink: 0, marginTop: 4 }} />
                    {t(`contact.why.items.${i}`)}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* ── Right: form ───────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ background: 'var(--c-surface-2)', padding: '2.5rem' }}
          >
            <h3
              className="display-title"
              style={{ fontSize: '1.5rem', color: 'white', marginBottom: '2rem' }}
            >
              {t('contact.form.title')}
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
              {/* Name */}
              <div>
                <label style={labelStyle}>{t('contact.form.nameLabel')}</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder={t('contact.form.namePlaceholder')}
                  style={inputStyle}
                  onFocus={e    => (e.target.style.borderColor = 'rgba(79,195,195,0.5)')}
                  onBlur={e     => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle}>{t('contact.form.emailLabel')}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder={t('contact.form.emailPlaceholder')}
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = 'rgba(79,195,195,0.5)')}
                  onBlur={e  => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
              </div>

              {/* Message */}
              <div>
                <label style={labelStyle}>{t('contact.form.messageLabel')}</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  placeholder={t('contact.form.messagePlaceholder')}
                  style={{ ...inputStyle, resize: 'none' }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(79,195,195,0.5)')}
                  onBlur={e  => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
              </div>

              {/* Status */}
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display:    'flex',
                    alignItems: 'center',
                    gap:        8,
                    padding:    '12px 16px',
                    background: 'rgba(79,195,195,0.08)',
                    border:     '1px solid rgba(79,195,195,0.25)',
                    color:      'var(--c-accent)',
                    fontSize:   '0.88rem',
                  }}
                >
                  <CheckCircle size={18} />
                  {t('contact.form.success', { name: submittedName })}
                </motion.div>
              )}
              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display:    'flex',
                    alignItems: 'center',
                    gap:        8,
                    padding:    '12px 16px',
                    background: 'rgba(232,75,58,0.08)',
                    border:     '1px solid rgba(232,75,58,0.25)',
                    color:      '#E84B3A',
                    fontSize:   '0.88rem',
                  }}
                >
                  <AlertCircle size={18} />
                  {t('contact.form.error')}
                </motion.div>
              )}

              {/* Consent */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <input
                  type="checkbox"
                  id="consent"
                  checked={consentChecked}
                  onChange={e => setConsentChecked(e.target.checked)}
                  required
                  style={{ marginTop: 3, accentColor: 'var(--c-accent)', flexShrink: 0 }}
                />
                <label
                  htmlFor="consent"
                  style={{ fontSize: '0.76rem', color: 'var(--c-text-3)', lineHeight: 1.6, cursor: 'pointer' }}
                >
                  {t('contact.form.consentText')}{' '}
                  <button
                    type="button"
                    onClick={() => onOpenLegal?.('privacy')}
                    style={{ background: 'none', border: 'none', color: 'var(--c-accent)', cursor: 'pointer', fontSize: 'inherit', padding: 0, textDecoration: 'underline' }}
                  >
                    {t('legal.privacy.linkTitle')}
                  </button>
                  {' '}{t('contact.form.consentAnd')}{' '}
                  <button
                    type="button"
                    onClick={() => onOpenLegal?.('consent')}
                    style={{ background: 'none', border: 'none', color: 'var(--c-accent)', cursor: 'pointer', fontSize: 'inherit', padding: 0, textDecoration: 'underline' }}
                  >
                    {t('legal.consent.linkTitle')}
                  </button>
                  .
                </label>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isSubmitting || !consentChecked}
                whileHover={{ scale: isSubmitting || !consentChecked ? 1 : 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary"
                style={{ justifyContent: 'center', width: '100%' }}
              >
                {isSubmitting ? (
                  <>
                    <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                    {t('contact.form.sending')}
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    {t('contact.form.submit')}
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.2); }
      `}</style>
    </section>
  );
};

export default Contact;
