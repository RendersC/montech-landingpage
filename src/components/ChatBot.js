import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, RotateCcw, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/* ── Config ──────────────────────────────────────────────────────────────── */
const OPENROUTER_KEY      = process.env.REACT_APP_OPENROUTER_KEY;
const OPENROUTER_MODEL    = 'openai/gpt-4o-mini';
const STORAGE_KEY         = 'steppedev_chat_v1';
const MAX_HISTORY         = 20;

/* Re-using existing notification channel */
const TELEGRAM_BOT_TOKEN  = '8631734357:AAEWTyh_iE5zc4N-TVL-1sAgXwHd_dVSpps';
const TELEGRAM_CHAT_ID    = '1555289492';

/* ── System prompt — company knowledge + lead-capture instructions ────── */
const SYSTEM_PROMPT = `Ты — Steppi, AI-ассистент компании SteppeDev. Дружелюбный, лаконичный, по делу.

# КОМПАНИЯ
SteppeDev — IT-студия из Казахстана. Делаем под ключ:
• Чат-боты для бизнеса (Telegram, WhatsApp) с интеграциями (CRM, оплата, БД)
• AI-ассистенты на базе GPT/Claude — поддержка клиентов, автоматизация процессов
• Лендинги и веб-сайты — современные, быстрые, конверсионные

# СТАТИСТИКА И ПОДХОД
• 50+ завершённых проектов · 98% удовлетворённость · поддержка 24/7
• Срок: от 3 дней до 2-3 недель в зависимости от объёма
• Принципы: оплата по факту результата, прозрачные сроки, индивидуальный подход
• Верифицированы на Kwork (десятки 5★ отзывов)

# КОНТАКТЫ
• Telegram: @sdpazdacha
• WhatsApp: +7 708 657 0811
• Email: steppedev@gmail.com

# ПРАВИЛА ОТВЕТОВ
1. Пиши кратко (1-3 предложения), на языке собеседника (русский/английский/казахский — определи по первому сообщению).
2. Точную стоимость не называй — она зависит от ТЗ. Можешь дать ориентир: чат-боты от $200, AI-ассистенты от $400, лендинги от $300, но всегда добавляй "финальную цену озвучит менеджер после ТЗ".
3. Не выдумывай факты, услуги или сроки. Если не знаешь — честно скажи и предложи связаться с менеджером.
4. Будь полезным: задавай уточняющие вопросы, чтобы понять задачу клиента.

# ЗАХВАТ ЛИДОВ — КРИТИЧЕСКИ ВАЖНО
Когда клиент явно проявляет интерес сотрудничать (просит связаться с менеджером, оставляет контакт, говорит "хочу заказать", "обсудить проект", даёт телефон/email/Telegram-юзернейм/имя), В КОНЦЕ СВОЕГО ОТВЕТА добавь специальный тег:

[LEAD]{"name":"имя или 'не указано'","contact":"контакт или 'не указано'","interest":"что хочет коротко","urgency":"low/medium/high"}[/LEAD]

Этот тег невидим для пользователя — система автоматически уведомит менеджера.

Не используй [LEAD] для общих вопросов. Только когда есть явное намерение сотрудничать ИЛИ оставлен реальный контакт.

Пример хорошего ответа:
Юзер: "Хочу чат-бота для записи в салон, я Анна, телега @anna_k"
Ты: "Анна, отлично! Передал запрос менеджеру — он свяжется с вами в Telegram сегодня. Уточнит детали и сделает расчёт.
[LEAD]{"name":"Анна","contact":"@anna_k (Telegram)","interest":"Чат-бот для записи в салон красоты","urgency":"high"}[/LEAD]"`;

/* ── Initial greetings per language ────────────────────────────────────── */
const GREETINGS = {
  ru: 'Привет! Я Steppi, AI-ассистент SteppeDev 🤖 Помогу с вопросами о наших услугах: чат-боты, AI-ассистенты, лендинги. О чём расскажу?',
  en: 'Hi! I\'m Steppi, the SteppeDev AI assistant 🤖 Happy to help with questions about our services: chatbots, AI assistants, landing pages. What\'s on your mind?',
  kk: 'Сәлем! Мен Steppi, SteppeDev AI-ассистенті 🤖 Қызметтеріміз туралы сұрақтарға жауап беремін: чат-боттар, AI-ассистенттер, лендингтер. Не айтайын?',
};

/* ── Send a captured lead to Telegram ──────────────────────────────────── */
const notifyTelegram = async (lead, history) => {
  const ctx = history
    .slice(-4)
    .map(m => `${m.role === 'user' ? '👤' : '🤖'} ${m.content.slice(0, 200)}`)
    .join('\n');

  const urgencyEmoji = { high: '🔥', medium: '⚡', low: '💡' }[lead.urgency] || '💬';
  const text =
    `${urgencyEmoji} *AI-чатбот: НОВЫЙ ЛИД!*\n\n` +
    `👤 *Имя:* ${lead.name || '—'}\n` +
    `📞 *Контакт:* ${lead.contact || '—'}\n` +
    `💬 *Интерес:* ${lead.interest || '—'}\n` +
    `⚡ *Срочность:* ${lead.urgency || 'medium'}\n\n` +
    `📝 *Контекст диалога:*\n${ctx}`;

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text, parse_mode: 'Markdown' }),
    });
  } catch (e) {
    console.error('[ChatBot] Telegram notify failed:', e);
  }
};

/* ── Three-dot typing indicator ────────────────────────────────────────── */
const Typing = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '12px 16px' }}>
    {[0, 1, 2].map(i => (
      <motion.div
        key={i}
        animate={{ y: [0, -4, 0], opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
        style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--c-accent)' }}
      />
    ))}
  </div>
);

/* ── Main component ────────────────────────────────────────────────────── */
const ChatBot = () => {
  const { i18n } = useTranslation();
  const [isOpen,    setIsOpen]    = useState(false);
  const [messages,  setMessages]  = useState([]);
  const [input,     setInput]     = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const scrollRef = useRef(null);
  const inputRef  = useRef(null);

  /* Load saved history */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setMessages(JSON.parse(raw));
    } catch {}
  }, []);

  /* Persist on change + auto-scroll */
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_HISTORY))); } catch {}
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  /* Focus input when opened */
  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen]);

  const greeting = GREETINGS[i18n.language] || GREETINGS.en;

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    if (!OPENROUTER_KEY) {
      console.warn('[ChatBot] No REACT_APP_OPENROUTER_KEY set');
      setMessages(m => [...m,
        { role: 'user',      content: text },
        { role: 'assistant', content: 'Чат временно недоступен. Напишите нам в Telegram: @sdpazdacha' },
      ]);
      setInput('');
      return;
    }

    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method:  'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_KEY}`,
          'Content-Type':  'application/json',
          'HTTP-Referer':  window.location.origin,
          'X-Title':       'SteppeDev Site Chatbot',
        },
        body: JSON.stringify({
          model:       OPENROUTER_MODEL,
          temperature: 0.6,
          max_tokens:  500,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...newMessages.slice(-MAX_HISTORY),
          ],
        }),
      });

      if (!res.ok) throw new Error(`API ${res.status}`);
      const data = await res.json();
      const raw  = data.choices?.[0]?.message?.content || '';

      /* Extract [LEAD]{...}[/LEAD] tag, if any */
      const leadMatch = raw.match(/\[LEAD\]([\s\S]*?)\[\/LEAD\]/);
      const visible   = raw.replace(/\[LEAD\][\s\S]*?\[\/LEAD\]/g, '').trim();

      if (leadMatch) {
        try {
          const lead = JSON.parse(leadMatch[1]);
          notifyTelegram(lead, newMessages);
        } catch (e) {
          console.warn('[ChatBot] Bad LEAD JSON:', leadMatch[1]);
        }
      }

      const finalMessages = [...newMessages, { role: 'assistant', content: visible || '...' }];
      setMessages(finalMessages);
      if (!isOpen) setHasUnread(true);
    } catch (e) {
      console.error('[ChatBot] API error:', e);
      setMessages(m => [...m, {
        role:    'assistant',
        content: 'Что-то пошло не так. Напишите нам напрямую: @sdpazdacha (Telegram) или steppedev@gmail.com',
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, isOpen]);

  const resetChat = () => {
    if (window.confirm('Очистить историю чата?')) {
      setMessages([]);
      try { localStorage.removeItem(STORAGE_KEY); } catch {}
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /* Display: prepend greeting if no real messages yet */
  const display = messages.length === 0
    ? [{ role: 'assistant', content: greeting }]
    : messages;

  return (
    <>
      {/* ── Floating launcher ─────────────────────────────────────────── */}
      <motion.button
        onClick={() => setIsOpen(v => !v)}
        initial={{ opacity: 0, scale: 0.6, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open chat"
        style={{
          position:   'fixed',
          right:      24,
          bottom:     24,
          width:      62,
          height:     62,
          background: 'linear-gradient(135deg, #4FC3C3 0%, #2D5F5D 100%)',
          border:     'none',
          cursor:     'pointer',
          clipPath:   'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          display:    'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow:  '0 8px 32px rgba(79, 195, 195, 0.45)',
          zIndex:     9998,
        }}
      >
        <motion.div
          animate={isOpen ? { rotate: 180 } : { rotate: 0 }}
          transition={{ duration: 0.3 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {isOpen ? <X size={22} color="white" /> : <MessageCircle size={22} color="white" />}
        </motion.div>

        {/* Pulsing ring */}
        {!isOpen && (
          <motion.div
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            style={{
              position: 'absolute',
              inset:    -2,
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              background: '#4FC3C3',
              zIndex:    -1,
            }}
          />
        )}

        {/* Unread dot */}
        {hasUnread && !isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              position: 'absolute',
              top:      6,
              right:    6,
              width:    12,
              height:   12,
              borderRadius: '50%',
              background:   '#E84B3A',
              boxShadow:    '0 0 8px rgba(232,75,58,0.8)',
            }}
          />
        )}
      </motion.button>

      {/* ── Chat panel ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{ opacity: 0,   y: 24, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position:    'fixed',
              right:       24,
              bottom:      102,
              width:       'min(390px, calc(100vw - 32px))',
              height:      'min(580px, calc(100vh - 140px))',
              background:  'rgba(2, 22, 50, 0.92)',
              border:      '1px solid rgba(79, 195, 195, 0.25)',
              backdropFilter:        'blur(20px)',
              WebkitBackdropFilter:  'blur(20px)',
              boxShadow:   '0 20px 60px rgba(0,0,0,0.6), 0 0 60px rgba(79,195,195,0.1)',
              display:     'flex',
              flexDirection: 'column',
              overflow:    'hidden',
              zIndex:      9999,
            }}
          >
            {/* Top accent bar */}
            <div style={{
              height:     2,
              background: 'linear-gradient(to right, transparent, #4FC3C3 50%, transparent)',
            }} />

            {/* Header */}
            <div style={{
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'space-between',
              padding:        '14px 18px',
              borderBottom:   '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width:      36,
                    height:     36,
                    background: 'linear-gradient(135deg, #4FC3C3, #2D5F5D)',
                    clipPath:   'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                    display:    'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Sparkles size={16} color="white" />
                </div>
                <div>
                  <div style={{
                    fontFamily:    '"Barlow Condensed", sans-serif',
                    fontWeight:    700,
                    fontSize:      '0.95rem',
                    color:         'white',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    lineHeight:    1.1,
                  }}>
                    Steppi · AI
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'rgba(125,211,210,0.85)', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4FC3C3', boxShadow: '0 0 6px #4FC3C3' }} />
                    online
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 4 }}>
                <button
                  onClick={resetChat}
                  title="Очистить историю"
                  style={{
                    width: 30, height: 30,
                    background: 'rgba(255,255,255,0.04)',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'rgba(255,255,255,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <RotateCcw size={14} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    width: 30, height: 30,
                    background: 'rgba(255,255,255,0.04)',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'rgba(255,255,255,0.7)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              style={{
                flex:    1,
                overflowY: 'auto',
                padding: '16px 16px 8px',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              {display.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    display:        'flex',
                    justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    style={{
                      maxWidth:    '82%',
                      padding:     '10px 14px',
                      fontSize:    '0.88rem',
                      lineHeight:  1.55,
                      whiteSpace:  'pre-wrap',
                      wordBreak:   'break-word',
                      ...(m.role === 'user'
                        ? {
                            background: 'linear-gradient(135deg, rgba(79,195,195,0.22) 0%, rgba(45,95,93,0.28) 100%)',
                            color:      'rgba(255,255,255,0.95)',
                            border:     '1px solid rgba(79,195,195,0.3)',
                            borderTopRightRadius: 2,
                            borderRadius: '12px 2px 12px 12px',
                          }
                        : {
                            background: 'rgba(255,255,255,0.05)',
                            color:      'rgba(255,255,255,0.88)',
                            border:     '1px solid rgba(255,255,255,0.07)',
                            borderTopLeftRadius: 2,
                            borderRadius: '2px 12px 12px 12px',
                          }
                      ),
                    }}
                  >
                    {m.content}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ display: 'flex', justifyContent: 'flex-start' }}
                >
                  <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    border:     '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '2px 12px 12px 12px',
                  }}>
                    <Typing />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div style={{
              padding:    12,
              borderTop:  '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(0,0,0,0.2)',
              display:    'flex',
              gap:        8,
              alignItems: 'flex-end',
            }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Напишите сообщение..."
                rows={1}
                style={{
                  flex: 1,
                  background:   'rgba(255,255,255,0.04)',
                  border:       '1px solid rgba(255,255,255,0.1)',
                  color:        'white',
                  fontFamily:   'Outfit, sans-serif',
                  fontSize:     '0.88rem',
                  padding:      '10px 12px',
                  outline:      'none',
                  resize:       'none',
                  minHeight:    40,
                  maxHeight:    100,
                  lineHeight:   1.4,
                }}
                onFocus={e => (e.target.style.borderColor = 'rgba(79,195,195,0.5)')}
                onBlur={e =>  (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                style={{
                  width: 40, height: 40,
                  background: input.trim() && !isLoading
                    ? 'linear-gradient(135deg, #4FC3C3 0%, #2D5F5D 100%)'
                    : 'rgba(255,255,255,0.06)',
                  border: 'none',
                  cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  color: 'white',
                  flexShrink: 0,
                  clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                }}
              >
                <Send size={15} />
              </button>
            </div>

            {/* Footer hint */}
            <div style={{
              padding:    '6px 12px 8px',
              fontSize:   '0.65rem',
              color:      'rgba(255,255,255,0.3)',
              textAlign:  'center',
              letterSpacing: '0.04em',
              borderTop:  '1px solid rgba(255,255,255,0.04)',
            }}>
              powered by SteppeDev AI
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
