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
  followUpChips?: string[];
  isFallback?: boolean;
  unansweredQuery?: string;
  isLeadAction?: boolean;
  showPreviewCard?: boolean;
  showConfirmationControls?: boolean;
  taskState?: any;
  leadFlowData?: {
    step: 'business_type' | 'need' | 'name' | 'phone' | 'complete';
    businessType?: string;
    need?: string;
    name?: string;
    phone?: string;
  };
}

interface GuidedLeadState {
  step: 'idle' | 'business_type' | 'need' | 'name' | 'phone' | 'complete';
  businessType: string;
  need: string;
  name: string;
  phone: string;
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

  const [leadState, setLeadState] = useState<GuidedLeadState>({
    step: 'idle',
    businessType: '',
    need: '',
    name: '',
    phone: ''
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

  // Starter suggestion chips
  const starterChips = [
    '🍽️ Resto-X Demo & Price',
    '🚀 3-Week Custom App',
    '💡 Why Choose MyBooks?',
    '💰 Complete Pricing Plans',
    '📋 Start Project / Get Quote',
    '🤝 Talk to Founder Deep Mehta'
  ];

  // Initialize welcome message if empty
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcome = language === 'hi'
        ? "नमस्ते! मैं **Ojas** हूँ, MyBooks का आधिकारिक AI कोपायलट। आप मुझसे हमारे सॉफ़्टवेयर, Resto-X, 3-हफ़्ते के कस्टम ऐप्स, प्राइसिंग के बारे में पूछ सकते हैं या नीचे दिए गए विकल्पों से अपना प्रोजेक्ट शुरू कर सकते हैं!"
        : "Hello! I am **Ojas**, the official AI copilot for MyBooks. How can I help your business grow today? Ask me about our custom business apps, Resto-X, pricing, why we are better than competitors, or start your project below!";

      setMessages([
        {
          id: 'welcome',
          sender: 'bot',
          text: welcome,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          followUpChips: starterChips
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
    setLeadState({ step: 'idle', businessType: '', need: '', name: '', phone: '' });
    const welcome = language === 'hi'
      ? "बातचीत साफ़ कर दी गई है। मैं **Ojas** हूँ, पूछिए मैं आपकी क्या सहायता कर सकता हूँ?"
      : "Chat cleared. I am **Ojas**, how can I assist your business today?";
    const freshMessages: Message[] = [{
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: welcome,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      followUpChips: starterChips
    }];
    setMessages(freshMessages);
    try {
      localStorage.setItem('ojas_chat_messages', JSON.stringify(freshMessages));
    } catch {}
  };

  /**
   * Start or Advance the Guided Lead Flow (Task 5: business type -> need -> name -> phone)
   */
  const startGuidedLeadFlow = () => {
    setLeadState({ step: 'business_type', businessType: '', need: '', name: '', phone: '' });
    const botMsg: Message = {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: language === 'hi'
        ? `### 📋 कस्टम प्रोजेक्ट इनटेक (कदम 1 / 4)\n\n**कदम 1: आपका बिज़नेस किस श्रेणी का है?**\nनीचे दिए गए विकल्पों में से चुनें या लिखकर बताएं:`
        : `### 📋 Custom Project Intake (Step 1 of 4)\n\n**Step 1: What type of business do you run?**\nSelect an option below or type your own:`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      followUpChips: [
        '🍽️ Restaurant / Cafe / Bar',
        '🛍️ Retail Shop / Store',
        '🏋️ Gym / Fitness Studio',
        '💒 Wedding / Event Planner',
        '🏥 Healthcare / Clinic',
        '🏢 Other Custom Business'
      ]
    };
    setMessages(prev => [...prev, botMsg]);
  };

  const advanceGuidedLeadFlow = async (userText: string) => {
    const clean = userText.trim();

    // Check cancellation
    if (clean.toLowerCase() === 'cancel' || clean.toLowerCase() === 'cancel flow') {
      setLeadState({ step: 'idle', businessType: '', need: '', name: '', phone: '' });
      const cancelMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: language === 'hi'
          ? "प्रोजेक्ट इनटेक रद्द कर दिया गया है। आप मुझसे कोई भी सामान्य सवाल पूछ सकते हैं!"
          : "Project intake has been cancelled. Feel free to ask me anything about our software or pricing!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        followUpChips: starterChips
      };
      setMessages(prev => [...prev, cancelMsg]);
      return;
    }

    if (leadState.step === 'business_type') {
      const updated = { ...leadState, businessType: clean, step: 'need' as const };
      setLeadState(updated);
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: language === 'hi'
          ? `शानदार! बिज़नेस: **${clean}**\n\n**कदम 2 / 4: आपकी मुख्य सॉफ़्टवेयर आवश्यकता क्या है?**\nअपनी प्राथमिकता चुनें:`
          : `Excellent! Business: **${clean}**\n\n**Step 2 of 4: What is your primary software or digital requirement?**\nSelect your focus below:`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        followUpChips: [
          '🧾 Billing & KOT POS System',
          '📱 Custom Mobile App (Android/iOS)',
          '💻 Custom Web ERP & Admin Portal',
          '🌐 Fast Responsive Website & SEO',
          '📈 Digital Growth & Marketing',
          '⚙️ Full End-to-End Suite'
        ]
      };
      setMessages(prev => [...prev, botMsg]);
      return;
    }

    if (leadState.step === 'need') {
      const updated = { ...leadState, need: clean, step: 'name' as const };
      setLeadState(updated);
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: language === 'hi'
          ? `समझ गया! आवश्यकता: **${clean}**\n\n**कदम 3 / 4: क्या मैं आपका शुभ नाम जान सकता हूँ?**`
          : `Got it! Requirement: **${clean}**\n\n**Step 3 of 4: May I know your name?**`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        followUpChips: []
      };
      setMessages(prev => [...prev, botMsg]);
      return;
    }

    if (leadState.step === 'name') {
      const updated = { ...leadState, name: clean, step: 'phone' as const };
      setLeadState(updated);
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: language === 'hi'
          ? `धन्यवाद, **${clean}** जी!\n\n**कदम 4 / 4: आपसे संपर्क करने के लिए आपका 10-अंकों का WhatsApp या फ़ोन नंबर क्या है?**`
          : `Thank you, **${clean}**!\n\n**Step 4 of 4: What is the best 10-digit WhatsApp or Phone number to reach you?**`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        followUpChips: []
      };
      setMessages(prev => [...prev, botMsg]);
      return;
    }

    if (leadState.step === 'phone') {
      const updated = { ...leadState, phone: clean, step: 'complete' as const };
      setLeadState(updated);

      const summaryCard = language === 'hi'
        ? `### 🎉 आपका प्रोजेक्ट संक्षेप तैयार है!\n\n` +
          `• **ग्राहक नाम:** **${updated.name}**\n` +
          `• **फ़ोन / WhatsApp:** **${updated.phone}**\n` +
          `• **बिज़नेस श्रेणी:** **${updated.businessType}**\n` +
          `• **सॉफ़्टवेयर आवश्यकता:** **${updated.need}**\n` +
          `• **डिलीवरी गारंटी:** **3 हफ़्ते (21 दिन)**\n` +
          `• **स्वामित्व:** **100% फुल लाइफटाइम सोर्स कोड हैंडओवर**\n\n` +
          `आपका प्रोजेक्ट ब्लूप्रिंट और स्पेशल लॉन्च रेट लॉक करने के लिए नीचे दिए गए बटन से सीधे संस्थापक **Deep Mehta** से WhatsApp पर जुड़ें:`
        : `### 🎉 Your Project Brief is Ready!\n\n` +
          `• **Client Name:** **${updated.name}**\n` +
          `• **Phone / WhatsApp:** **${updated.phone}**\n` +
          `• **Business Type:** **${updated.businessType}**\n` +
          `• **Requirement:** **${updated.need}**\n` +
          `• **Guaranteed Delivery:** **3 Weeks (21 Days)**\n` +
          `• **Ownership:** **100% Lifetime Source Code Handover**\n\n` +
          `To finalize your architecture blueprint and lock in launch pricing, tap below to connect directly with Founder **Deep Mehta** on WhatsApp:`;

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: summaryCard,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        leadFlowData: updated,
        isLeadAction: true,
        followUpChips: ['🔄 Start Another Inquiry', 'Show All Pricing', 'Why Choose MyBooks?']
      };
      setMessages(prev => [...prev, botMsg]);
      return;
    }
  };

  const handleSend = async (presetQuery?: string) => {
    const query = (presetQuery || inputVal).trim();
    if (!query || isTyping) return;

    // Reset input
    setInputVal('');

    // Handle "Start Another Inquiry"
    if (query === '🔄 Start Another Inquiry') {
      startGuidedLeadFlow();
      return;
    }

    // Append user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Realistic typing indicator delay (380ms)
    await new Promise(res => setTimeout(res, 380));

    // If currently in Guided Lead Flow, handle step
    if (leadState.step !== 'idle' && leadState.step !== 'complete') {
      setIsTyping(false);
      await advanceGuidedLeadFlow(query);
      return;
    }

    // Check if user is initiating the guided lead flow
    const lowerQ = query.toLowerCase();
    const isLeadFlowTrigger =
      query.includes('Start Project') ||
      query.includes('Get Quote') ||
      query.includes('Start Guided Project Flow') ||
      lowerQ === 'start project' ||
      lowerQ === 'get quote' ||
      lowerQ === 'hire' ||
      lowerQ === 'hire you' ||
      lowerQ.includes('mujhe app banwana hai') ||
      lowerQ.includes('software banwana hai');

    if (isLeadFlowTrigger) {
      setIsTyping(false);
      startGuidedLeadFlow();
      return;
    }

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
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              followUpChips: starterChips.slice(0, 3)
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

    // 2. High-fidelity verified engine with 100+ intents, fuzzy matching, and autonomous task support
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
        taskState: answer.taskState,
        followUpChips: answer.followUpChips,
        isFallback: answer.isFallback,
        unansweredQuery: answer.unansweredQuery
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
        isLeadAction: fallback.isLead,
        followUpChips: fallback.followUpChips,
        isFallback: fallback.isFallback,
        unansweredQuery: fallback.unansweredQuery
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

  const handleDirectWhatsAppLead = (msg?: Message) => {
    if (msg?.leadFlowData && msg.leadFlowData.name) {
      const leadText = encodeURIComponent(
        `*New Project Inquiry via Ojas AI*\n\n` +
        `*Client Name:* ${msg.leadFlowData.name}\n` +
        `*Phone / WhatsApp:* ${msg.leadFlowData.phone}\n` +
        `*Business Type:* ${msg.leadFlowData.businessType}\n` +
        `*Requirement:* ${msg.leadFlowData.need}\n` +
        `*Timeline:* 3-Week Delivery Guarantee\n` +
        `*Source Code:* 100% Lifetime Ownership\n\n` +
        `_Connecting with Founder Deep Mehta to finalize the blueprint._`
      );
      window.open(`https://api.whatsapp.com/send/?phone=919644570828&text=${leadText}`, '_blank');
      return;
    }

    if (msg?.isFallback && msg.unansweredQuery) {
      const fallbackText = encodeURIComponent(
        `*Question for Founder Deep Mehta via Ojas AI*\n\n` +
        `*My Question:* ${msg.unansweredQuery}\n\n` +
        `_Looking forward to discussing this directly!_`
      );
      window.open(`https://api.whatsapp.com/send/?phone=919644570828&text=${fallbackText}`, '_blank');
      return;
    }

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
                  <Sparkles size={11} /> AI COPILOT
                </span>
              </div>
              <p className="ojas-brand-sub">
                <span className="ojas-status-dot" />
                {connectionStatus === 'ollama' ? 'Local AI Active' : '100+ Intents Active'} • {activeModel}
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

        {/* Quick Suggestion Chips (Compact wrapping grid) */}
        <div className="ojas-dialog-chips">
          {starterChips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              className="chip-bubble"
              onClick={() => handleSend(chip)}
            >
              {chip}
            </button>
          ))}
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

                {/* Follow-up / Suggestion Chips beneath bot message */}
                {msg.followUpChips && msg.followUpChips.length > 0 && (
                  <div className="ojas-inline-chips">
                    {msg.followUpChips.map((chip, cIdx) => (
                      <button
                        key={cIdx}
                        type="button"
                        className="ojas-msg-chip"
                        onClick={() => handleSend(chip)}
                      >
                        <span>{chip}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Fallback Action Button (Task 4) */}
                {msg.isFallback && (
                  <button
                    type="button"
                    className="ojas-whatsapp-fallback-btn"
                    onClick={() => handleDirectWhatsAppLead(msg)}
                  >
                    <MessageCircle size={15} />
                    <span>Chat on WhatsApp with Founder Deep Mehta</span>
                    <ArrowRight size={14} />
                  </button>
                )}

                {/* Task Engine Confirmation Controls */}
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

                {/* Lead Action Button (Task 5 & Buy Intent) */}
                {msg.isLeadAction && !msg.isFallback && (
                  <button
                    type="button"
                    className="ojas-dispatch-lead-btn"
                    onClick={() => handleDirectWhatsAppLead(msg)}
                  >
                    <MessageCircle size={15} />
                    <span>Connect with Founder Deep Mehta via WhatsApp</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator (Task 8) */}
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
                  <span className="vayu-thinking-text">Ojas is typing...</span>
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
              leadState.step === 'business_type'
                ? "Enter your business type (e.g. Restaurant, Gym)..."
                : leadState.step === 'need'
                ? "Enter your requirement (e.g. Mobile App, POS)..."
                : leadState.step === 'name'
                ? "Enter your full name..."
                : leadState.step === 'phone'
                ? "Enter your 10-digit phone number..."
                : language === 'hi'
                ? "Ojas से कुछ भी पूछें (हिंदी, English, या Hinglish)..."
                : "Ask Ojas about MyBooks, pricing, Resto-X, apps..."
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
