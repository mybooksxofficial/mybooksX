import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import {
  X,
  Send,
  Sparkles,
  MessageCircle,
  ArrowRight,
  User,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { OjasIntelligentBrain } from '../services/ojasIntelligentBrain';
import { formStateService } from '../services/formStateService';
import { MarkdownRenderer } from './MarkdownRenderer';
import './OjasAiModal.css';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  isLeadAction?: boolean;
  showPreviewCard?: boolean;
  showConfirmationControls?: boolean;
  taskState?: any;
}

interface OjasAiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OjasAiModal: React.FC<OjasAiModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem('ojas_chat_messages');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'ollama' | 'verified'>('checking');
  const [activeModel, setActiveModel] = useState<string>('Ojas Core Brain');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check Ollama connectivity on mount/open
  useEffect(() => {
    if (!isOpen) return;

    const checkOllama = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1200);
        const res = await fetch('http://localhost:11434/api/tags', { signal: controller.signal });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.models) && data.models.length > 0) {
            setConnectionStatus('ollama');
            setActiveModel(`Ollama (${data.models[0].name})`);
            return;
          }
        }
      } catch {}
      setConnectionStatus('verified');
      setActiveModel('MyBooks Knowledge Mode');
    };

    checkOllama();
  }, [isOpen]);

  // Initialize welcome message if empty
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcome = language === 'hi'
        ? "नमस्ते! मैं **Ojas** हूँ, MyBooks का AI असिस्टेंट। आप मुझसे सॉफ़्टवेयर प्लानिंग, Resto-X, कस्टम मोबाइल ऐप्स, गणित या टेक्नोलॉजी के बारे में कुछ भी पूछ सकते हैं!"
        : "Hello! I am **Ojas**, the intelligent AI assistant for MyBooks. How can I help your business grow today? Ask me about our custom business apps, Resto-X, mathematics, or technology!";

      setMessages([
        {
          id: 'welcome',
          sender: 'bot',
          text: welcome,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [isOpen, language, messages.length]);

  // Persist messages in localStorage
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem('ojas_chat_messages', JSON.stringify(messages));
      } catch {}
    }
  }, [messages]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleClearChat = () => {
    const welcome = language === 'hi'
      ? "बातचीत साफ़ कर दी गई है। मैं **Ojas** हूँ, पूछिए मैं आपकी क्या सहायता कर सकता हूँ?"
      : "Chat cleared. I am **Ojas**, how can I assist you today?";
    const freshMessages: Message[] = [{
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: welcome,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }];
    setMessages(freshMessages);
    try {
      localStorage.setItem('ojas_chat_messages', JSON.stringify(freshMessages));
    } catch {}
  };

  const handleSend = async (presetQuery?: string) => {
    const query = (presetQuery || inputVal).trim();
    if (!query || isTyping) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    const historyTurns = messages.slice(-6).map(m => ({
      role: (m.sender === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
      content: m.text
    }));

    // 1. If Ollama is connected, query Ollama with timeout fallback
    if (connectionStatus === 'ollama') {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const sysPrompt = `You are Ojas, the official AI assistant associated with MyBooks. Deep Mehta is the founder of MyBooks.
CRITICAL RULES:
- Answer the user's actual question directly in the very first sentence.
- If asked "who is the founder" or "who is owner", state that Deep Mehta is the founder of MyBooks.
- If asked "what is deep", explain that Deep Mehta is the founder of MyBooks, or if referring to AI, explain Deep Learning.
- For math, percentages, MRR, coding, and general business, solve and explain directly.
- Do not repeat generic assistant introductions ("I am Ojas...").
- Do not redirect to WhatsApp or sales unless the user specifically asks for contact details.
- Never invent unverified company financial metrics (e.g. annual profit, private revenues).`;

        const modelToUse = activeModel.includes('(')
          ? activeModel.split('(')[1].replace(')', '')
          : 'qwen2.5:latest';

        const res = await fetch('http://localhost:11434/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: modelToUse,
            messages: [
              { role: 'system', content: sysPrompt },
              ...historyTurns,
              { role: 'user', content: query }
            ],
            stream: false
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (data.message?.content) {
            const botMsg: Message = {
              id: `bot-${Date.now()}`,
              sender: 'bot',
              text: data.message.content,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setIsTyping(false);
            setMessages(prev => [...prev, botMsg]);
            return;
          }
        }
      } catch (err) {
        console.warn('Ollama query timed out or failed, falling back to verified local brain:', err);
      }
    }

    // 2. High-fidelity verified engine with autonomous task support
    try {
      const answer = await OjasIntelligentBrain.resolveResponseAsync(query, historyTurns, language);

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: answer.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isLeadAction: answer.isLead,
        showPreviewCard: answer.showPreviewCard,
        showConfirmationControls: answer.showConfirmationControls,
        taskState: answer.taskState
      };

      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.warn('Async response generation encountered an error, falling back:', err);
      const fallback = OjasIntelligentBrain.resolveResponse(query, historyTurns, language);
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: fallback.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isLeadAction: fallback.isLead
      };
      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDirectWhatsAppLead = () => {
    const transcript = messages
      .map(m => `${m.sender.toUpperCase()}: ${m.text}`)
      .join('\n');

    const leadText = encodeURIComponent(
      `*New Ojas Assistant Inquiry*\n` +
      `*Client Chat Transcript:*\n${transcript.slice(-400)}\n\n` +
      `_Connecting to MyBooks Founder Deep Mehta & Engineering Team._`
    );

    window.open(`https://api.whatsapp.com/send/?phone=919644570828&text=${leadText}`, '_blank');
  };

  return (
    <div className="ojas-modal-overlay" onClick={onClose}>
      <div className="ojas-clean-dialog-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="ojas-dialog-header">
          <div className="ojas-dialog-brand">
            <div className={`ojas-avatar-box ${isTyping ? 'generating' : ''}`}>
              <img src="/logo/ojas-ai-logo.svg" alt="Ojas" className="ojas-logo-img" />
              <span className={`online-beacon ${isTyping ? 'pulsing' : ''}`} />
            </div>
            <div>
              <div className="ojas-brand-line">
                <h3>Ojas</h3>
                <span className="ojas-ai-tag">
                  <Sparkles size={11} /> AI ASSISTANT
                </span>
              </div>
              <p className="ojas-brand-sub">
                <span className="ojas-status-dot" />
                {connectionStatus === 'ollama' ? 'Local AI Connected' : 'Local Knowledge Active'} • {activeModel}
              </p>
            </div>
          </div>

          <div className="header-actions-group">
            <button
              type="button"
              className="dialog-icon-action"
              onClick={handleClearChat}
              title="Clear Conversation"
              aria-label="Clear Conversation"
            >
              <Trash2 size={16} />
            </button>
            <button
              type="button"
              className="dialog-close-btn"
              onClick={onClose}
              aria-label="Close Chat"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips (Compact wrapping grid, no horizontal scrollbar) */}
        <div className="ojas-dialog-chips">
          <button
            type="button"
            className="chip-bubble"
            onClick={() => handleSend("Explain MyBooks features.")}
          >
            Explain MyBooks features
          </button>
          <button
            type="button"
            className="chip-bubble"
            onClick={() => handleSend("Book Resto-X for me.")}
          >
            Book Resto-X
          </button>
          <button
            type="button"
            className="chip-bubble"
            onClick={() => handleSend("Book me something")}
          >
            Book me something
          </button>
          <button
            type="button"
            className="chip-bubble"
            onClick={() => handleSend("I want permanent lifetime license")}
          >
            Permanent Lifetime License
          </button>
          <button
            type="button"
            className="chip-bubble"
            onClick={() => handleSend("Why should we choose MyBooks?")}
          >
            Why Choose MyBooks?
          </button>
          <button
            type="button"
            className="chip-bubble"
            onClick={() => handleSend("Who founded MyBooks?")}
          >
            Who founded MyBooks?
          </button>
        </div>

        {/* Chat Messages */}
        <div className="ojas-dialog-body">
          {messages.map((msg) => (
            <div key={msg.id} className={`dialog-msg-item ${msg.sender}`}>
              <div className="dialog-msg-avatar">
                {msg.sender === 'bot' ? (
                  <div className="bot-symbol-frame">
                    <img src="/logo/ojas-ai-logo.svg" alt="Ojas" />
                  </div>
                ) : (
                  <div className="user-symbol-frame">
                    <User size={15} />
                  </div>
                )}
              </div>

              <div className="dialog-msg-content">
                <div className="dialog-bubble">
                  <MarkdownRenderer content={msg.text} />
                </div>
                <span className="dialog-msg-time">{msg.timestamp}</span>

                {msg.showConfirmationControls && (
                  <div className="ojas-enquiry-action-row">
                    <button
                      type="button"
                      className="btn-confirm-submit"
                      onClick={() => handleSend("Yes, submit.")}
                    >
                      <CheckCircle2 size={14} />
                      <span>Confirm & Submit Enquiry</span>
                    </button>
                    <button
                      type="button"
                      className="btn-view-form"
                      onClick={() => {
                        formStateService.triggerHighlightAndScroll();
                        onClose();
                      }}
                    >
                      <ArrowRight size={14} />
                      <span>View in Page Form</span>
                    </button>
                    <button
                      type="button"
                      className="btn-cancel-draft"
                      onClick={() => handleSend("Cancel this enquiry")}
                    >
                      <X size={14} />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}

                {msg.isLeadAction && (
                  <button
                    type="button"
                    className="ojas-dispatch-lead-btn"
                    onClick={handleDirectWhatsAppLead}
                  >
                    <MessageCircle size={15} />
                    <span>Connect with Founder Deep Mehta via WhatsApp</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="dialog-msg-item bot">
              <div className="dialog-msg-avatar">
                <div className="bot-symbol-frame generating-bot">
                  <img src="/logo/ojas-ai-logo.svg" alt="Ojas" />
                </div>
              </div>
              <div className="dialog-msg-content">
                <div className="typing-pill">
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                  <span className="vayu-thinking-text">Ojas is generating...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Footer */}
        <div className="ojas-dialog-footer">
          <input
            type="text"
            className="dialog-input"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              language === 'hi'
                ? "Ojas से कुछ भी पूछें (हिंदी या English)..."
                : "Ask Ojas about MyBooks, pricing, math, coding..."
            }
          />
          <button
            type="button"
            className="dialog-send-btn"
            onClick={() => handleSend()}
            disabled={!inputVal.trim() || isTyping}
            aria-label="Send"
          >
            <Send size={17} />
          </button>
        </div>
      </div>
    </div>
  );
};
