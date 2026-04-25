'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, ImagePlus, X, Mic, MicOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (message: string, image?: string, imageType?: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [image, setImage] = useState<{ data: string; type: string } | null>(null);
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleVoice = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((input.trim() || image) && !disabled) {
      onSend(input, image?.data, image?.type);
      setInput('');
      setImage(null);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setImage({ data: base64String, type: file.type });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      {image && (
        <div className="relative inline-block ml-4">
          <img 
            src={`data:${image.type};base64,${image.data}`} 
            alt="Preview" 
            className="h-20 w-20 object-cover rounded-xl border-2 border-primary-500 shadow-md"
          />
          <button
            onClick={() => setImage(null)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
      
      <form 
        onSubmit={handleSubmit}
        className="relative flex items-center space-x-2"
      >
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="p-4 rounded-2xl border border-slate-200 bg-white text-slate-400 hover:text-primary-600 hover:border-primary-200 transition-all shadow-sm"
          title="Upload Voter ID or document"
        >
          <ImagePlus className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={toggleVoice}
          disabled={disabled}
          className={cn(
            "p-4 rounded-2xl border border-slate-200 bg-white transition-all shadow-sm",
            isListening ? "text-red-500 border-red-200 bg-red-50 animate-pulse" : "text-slate-400 hover:text-primary-600 hover:border-primary-200"
          )}
          title="Speak to Civix"
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*"
          onChange={handleImageChange}
        />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type message or upload document..."
          className={cn(
            "flex-1 bg-white border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          disabled={disabled}
        />
        <button
          type="submit"
          disabled={disabled || (!input.trim() && !image)}
          className={cn(
            "bg-primary-600 text-white p-4 rounded-2xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/20",
            (disabled || (!input.trim() && !image)) && "opacity-50 cursor-not-allowed"
          )}
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
      {image && (
        <p className="text-[10px] text-slate-400 ml-4 flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
          Images are processed securely by Google Gemini and are never stored on our servers.
        </p>
      )}
    </div>
  );
}
