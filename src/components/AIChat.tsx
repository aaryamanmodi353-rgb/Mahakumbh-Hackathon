'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Mic } from 'lucide-react';
import { useLocationContext } from '@/context/LocationContext';
import styles from './AIChat.module.css';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
}

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: 'Namaste! I am your Kumbh Yatra AI Assistant. How can I help you with navigation, parking, or crowd information today?' }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const { language } = useLocationContext();

  const handleListen = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => setInput(event.results[0][0].transcript);
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    
    // Simulate AI response
    setTimeout(() => {
      let aiResponse = "I'm processing your request. Currently, the Triveni Sangam area is highly congested.";
      if (input.toLowerCase().includes('parking')) {
        aiResponse = "Parking Zone A is 85% full. I recommend diverting to Parking Zone B which has ample space.";
      } else if (input.toLowerCase().includes('route') || input.toLowerCase().includes('path')) {
        aiResponse = "The fastest route to the Ghat is via the blue corridor. I have highlighted it on your map.";
      }

      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: aiResponse }]);
    }, 1000);
  };

  return (
    <>
      {!isOpen && (
        <button 
          className={`${styles.chatToggle} animate-fade-in`} 
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare size={24} color="#fff" />
        </button>
      )}

      {isOpen && (
        <div className={`${styles.chatWindow} glass-panel animate-fade-in`}>
          <div className={styles.chatHeader}>
            <div className={styles.chatTitle}>
              <Bot size={20} color="#fff" />
              <span>Yatra Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className={styles.closeBtn}>
              <X size={20} />
            </button>
          </div>

          <div className={styles.chatMessages}>
            {messages.map(msg => (
              <div key={msg.id} className={`${styles.messageWrapper} ${msg.sender === 'user' ? styles.wrapperUser : styles.wrapperAi}`}>
                <div className={`${styles.messageBubble} ${msg.sender === 'user' ? styles.bubbleUser : styles.bubbleAi}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.chatInput}>
            <button 
              onClick={handleListen} 
              className={styles.micBtn} 
              style={{ background: 'none', border: 'none', color: isListening ? '#ff1744' : '#e0e6ed', cursor: 'pointer', padding: '0.5rem', transition: 'color 0.2s', animation: isListening ? 'pulse 1.5s infinite' : 'none' }}
              title="Click to speak"
            >
              <Mic size={20} />
            </button>
            <input 
              type="text" 
              placeholder={language === 'hi' ? "पार्किंग, रास्तों के बारे में पूछें..." : "Ask about parking, routes..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} className={styles.sendBtn}>
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
