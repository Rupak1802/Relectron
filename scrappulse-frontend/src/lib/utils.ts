import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function speakText(text: string, lang: string = 'en-US') {
  if (!('speechSynthesis' in window)) return;
  
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === 'mr' ? 'mr-IN' : lang === 'hi' ? 'hi-IN' : 'en-US';
  
  // Try to find a voice for the language
  const voices = window.speechSynthesis.getVoices();
  const voice = voices.find(v => v.lang.includes(utterance.lang)) || 
                voices.find(v => v.lang.includes(lang.split('-')[0]));
  
  if (voice) {
    utterance.voice = voice;
  }
  
  window.speechSynthesis.speak(utterance);
}
