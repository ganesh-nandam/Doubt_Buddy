import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Lightbulb, TrendingUp } from 'lucide-react';
import type { ChatMessage } from '@/types';
import { initialChatHistory } from '@/data';
import { getSocraticResponse, quickPrompts, detectTopic, isStruggling } from '@/socraticEngine';

interface SocraticChatProps {
  onNewDoubt: (topic: string, question: string) => void;
  onTopicDetected: (topic: string, subject: string) => void;
  onStruggling: (topic: string, subject: string) => void;
}

export function SocraticChat({ onNewDoubt, onTopicDetected, onStruggling }: SocraticChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialChatHistory);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>(quickPrompts.slice(0, 2));
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<ChatMessage[]>(messages);

  useEffect(() => {
    messagesRef.current = messages;
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const now = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: trimmed,
      timestamp: now,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Detect topic from the student's message
    const detected = detectTopic(trimmed);
    const topicName = detected?.topic ?? 'General';
    const subjectName = detected?.subject ?? 'Math';

    onNewDoubt(topicName, trimmed);

    if (detected) {
      onTopicDetected(detected.topic, detected.subject);
    }

    // If the student is struggling, flag it to update weak spots
    if (isStruggling(trimmed) && detected) {
      onStruggling(detected.topic, detected.subject);
    }

    try {
      const response = await getSocraticResponse(trimmed, messagesRef.current);
      const tutorMsg: ChatMessage = {
        id: `t-${Date.now()}`,
        role: 'tutor',
        text: response.text,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, tutorMsg]);
      setSuggestions(response.followUpSuggestions.length > 0 ? response.followUpSuggestions : quickPrompts.slice(0, 2));
    } catch {
      const tutorMsg: ChatMessage = {
        id: `t-${Date.now()}`,
        role: 'tutor',
        text: "I'm having trouble right now, but I'm still here! Can you tell me what you've tried so far?",
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, tutorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-card">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-ink-100 px-6 py-4">
        <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 shadow-lg">
          <Sparkles className="text-white" size={22} />
          <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-brand-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-display text-lg font-bold text-ink-900">Socratic Tutor</h3>
          <p className="text-xs text-brand-500">Online · Guides, never gives answers</p>
        </div>
        <div className="hidden items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 sm:flex">
          <TrendingUp className="text-brand-500" size={14} />
          <span className="text-xs font-semibold text-brand-600">7 doubts resolved</span>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto scrollbar-thin px-6 py-5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex animate-fade-in-up gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'tutor' && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600">
                <Sparkles className="text-white" size={16} />
              </div>
            )}
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                msg.role === 'user'
                  ? 'rounded-br-md bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-md'
                  : 'rounded-bl-md bg-ink-50 text-ink-800'
              }`}
            >
              <p>{msg.text}</p>
              <p className={`mt-1.5 text-[10px] ${msg.role === 'user' ? 'text-brand-100' : 'text-ink-400'}`}>
                {msg.timestamp}
              </p>
            </div>
            {msg.role === 'user' && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-ink-200 text-xs font-bold text-ink-600">
                AS
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex animate-fade-in items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600">
              <Sparkles className="text-white" size={16} />
            </div>
            <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-ink-50 px-4 py-3.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-2 w-2 rounded-full bg-brand-400"
                  style={{ animation: `bounceDot 1.4s infinite ease-in-out`, animationDelay: `${i * 0.2}s` }}
                />
              ))}
              <style>{`@keyframes bounceDot{0%,80%,100%{transform:scale(0.7);opacity:0.4}40%{transform:scale(1);opacity:1}}`}</style>
            </div>
          </div>
        )}
      </div>

      {/* Quick suggestions */}
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 px-6 pb-3">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => handleSend(s)}
              disabled={isTyping}
              className="flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700 transition-all hover:bg-brand-100 hover:shadow-sm disabled:opacity-40"
            >
              <Lightbulb size={13} />
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="border-t border-ink-100 p-4">
        <div className="flex items-center gap-2 rounded-2xl bg-ink-50 p-2 transition-all focus-within:ring-2 focus-within:ring-brand-300">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="Ask your doubt…"
            className="flex-1 bg-transparent px-2 py-2 text-sm text-ink-900 outline-none placeholder:text-ink-400"
          />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isTyping}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-md transition-all hover:shadow-lg active:scale-95 disabled:opacity-40 disabled:shadow-none"
          >
            <Send size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
