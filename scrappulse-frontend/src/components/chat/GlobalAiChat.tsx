import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Mic, Send, Bot, User, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export default function GlobalAiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: 'Hello! I am your Relectron Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  const speakText = (text: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    // Try to find a good English voice
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) || voices[0];
    if (voice) utterance.voice = voice;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('http://localhost:8081/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text })
      });
      
      if (!res.ok) throw new Error('API failed');
      const data = await res.json();
      
      const aiResponse: Message = { id: (Date.now() + 1).toString(), sender: 'ai', text: data.response };
      setMessages(prev => [...prev, aiResponse]);
      speakText(aiResponse.text);
      
    } catch (err) {
      console.error(err);
      const fallback: Message = { 
        id: (Date.now() + 1).toString(), 
        sender: 'ai', 
        text: "I'm having trouble connecting right now, but I'm here to help with your recycling needs!" 
      };
      setMessages(prev => [...prev, fallback]);
      speakText(fallback.text);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleListen = () => {
    if (isListening) return; // handled by onend usually, or we can force stop
    
    // Check for browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support speech recognition. Try using Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      // Auto-send after voice recognition? We can let them edit it first or just auto-send.
      // Let's just set the input so they can hit send.
    };
    
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };
    
    recognition.onend = () => setIsListening(false);
    
    recognition.start();
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[350px] sm:w-[400px] h-[500px] max-h-[calc(100vh-100px)] bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-teal text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold">Relectron AI</h3>
                  <p className="text-xs text-teal-100">Online</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  title="Toggle Voice Responses"
                >
                  {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-neutral-50/50">
              {messages.map((msg) => (
                <div key={msg.id} className={cn(
                  "flex gap-3 max-w-[85%]",
                  msg.sender === 'user' ? "self-end flex-row-reverse" : "self-start"
                )}>
                  <div className={cn(
                    "w-6 h-6 shrink-0 rounded-full flex items-center justify-center mt-1",
                    msg.sender === 'user' ? "bg-navy text-white" : "bg-teal text-white"
                  )}>
                    {msg.sender === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                  </div>
                  <div className={cn(
                    "p-3 rounded-2xl text-sm",
                    msg.sender === 'user' 
                      ? "bg-navy text-white rounded-tr-none" 
                      : "bg-white border border-border shadow-sm rounded-tl-none text-neutral-800"
                  )}>
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3 self-start max-w-[85%]">
                  <div className="w-6 h-6 shrink-0 rounded-full bg-teal text-white flex items-center justify-center mt-1">
                    <Bot className="w-3 h-3" />
                  </div>
                  <div className="bg-white border border-border shadow-sm p-4 rounded-2xl rounded-tl-none flex gap-1">
                    <div className="w-2 h-2 bg-neutral-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-neutral-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-neutral-300 rounded-full animate-bounce"></div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-border">
              <div className="flex items-center gap-2 bg-neutral-100 p-1.5 rounded-full border border-neutral-200 focus-within:border-teal transition-colors">
                <button 
                  onClick={toggleListen}
                  className={cn(
                    "p-2.5 rounded-full transition-all",
                    isListening ? "bg-red-500 text-white animate-pulse" : "bg-white text-neutral-500 hover:text-teal shadow-sm"
                  )}
                  title="Speak"
                >
                  <Mic className="w-4 h-4" />
                </button>
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask Relectron AI..."
                  className="flex-1 bg-transparent border-none outline-none px-2 text-sm text-neutral-800"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="p-2.5 bg-teal text-white rounded-full hover:bg-teal/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300 hover:scale-105 active:scale-95",
          isOpen ? "bg-navy" : "bg-gradient-to-r from-teal to-cyan-500 hover:shadow-[0_0_20px_rgba(0,137,123,0.4)]"
        )}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>
    </div>
  );
}
