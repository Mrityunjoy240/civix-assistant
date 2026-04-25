'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="relative flex items-center space-x-2"
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask about your registration, ballot, or deadlines..."
        className={cn(
          "flex-1 bg-white border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={disabled || !input.trim()}
        className={cn(
          "bg-primary-600 text-white p-4 rounded-2xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/20",
          (disabled || !input.trim()) && "opacity-50 cursor-not-allowed"
        )}
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  );
}
