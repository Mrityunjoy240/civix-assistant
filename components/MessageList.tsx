'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import MapWidget from './MapWidget';
import VoterCardGuide from './VoterCardGuide';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  imageType?: string;
}

interface MessageListProps {
  messages: Message[];
  loading?: boolean;
}

export default function MessageList({ messages, loading }: MessageListProps) {
  return (
    <div className="flex flex-col space-y-4 p-4">
      {messages.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center text-3xl mb-6 shadow-sm ring-1 ring-zinc-900/5">
            🗳️
          </div>
          <h2 className="text-xl font-semibold mb-2 text-zinc-900 tracking-tight">Welcome to Civix</h2>
          <p className="text-zinc-500 max-w-sm mb-8 text-sm leading-relaxed">
            Your sovereign election guide. Ask me anything about registration, deadlines, or voting.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 max-w-md">
            {["Check my voter registration", "When is the next deadline in Texas?", "What ID do I need to vote?"].map((suggestion, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i, type: "spring", stiffness: 400, damping: 25 }}
                className="bg-white ring-1 ring-inset ring-zinc-200 text-zinc-700 text-xs font-medium px-4 py-2 rounded-md shadow-sm hover:bg-zinc-50 transition-all active:scale-95"
                onClick={() => {
                  const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                  if (input) {
                    input.value = suggestion;
                    // Trigger change event for React state if needed, or rely on form submit
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                  }
                }}
              >
                {suggestion}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {messages.map((message) => {
        // Check for map tag: [MAP: some address]
        const mapMatch = message.content.match(/\[MAP:\s*(.*?)\]/);
        
        // Check for Voter ID Guide tag
        const showVoterGuide = message.content.includes('[SHOW_VOTER_ID_GUIDE]');

        const displayContent = message.content
          .replace(/\[MAP:\s*.*?\]/g, '')
          .replace(/\[SHOW_VOTER_ID_GUIDE\]/g, '')
          .trim();
        const mapAddress = mapMatch ? mapMatch[1] : null;

        return (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, x: message.role === 'user' ? 20 : -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={cn(
              "flex flex-col max-w-[85%] rounded-xl px-5 py-3 shadow-sm transition-all",
              message.role === 'user' 
                ? "ml-auto bg-zinc-900 text-white rounded-tr-sm" 
                : "mr-auto bg-white ring-1 ring-inset ring-zinc-200 text-zinc-900 rounded-tl-sm"
            )}
          >
            {message.image && (
              <div className="mb-3">
                <img 
                  src={`data:${message.imageType};base64,${message.image}`} 
                  alt="Uploaded document" 
                  className="rounded-lg max-h-60 w-full object-cover border border-white/20 shadow-sm"
                />
              </div>
            )}
            <div className={cn(
              "prose prose-sm max-w-none leading-relaxed prose-headings:text-inherit prose-p:my-1 prose-ul:my-1 prose-li:my-0.5",
              message.role === 'user' ? "prose-invert" : "prose-slate !text-slate-800"
            )}>
              <ReactMarkdown>
                {displayContent}
              </ReactMarkdown>
            </div>
            
            {message.role === 'assistant' && mapAddress && (
              <MapWidget address={mapAddress} />
            )}

            {message.role === 'assistant' && showVoterGuide && (
              <div className="mt-4 w-full max-w-xl">
                <VoterCardGuide inlineMode={true} />
              </div>
            )}
          </motion.div>
        );
      })}

      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mr-auto w-full max-w-[85%] space-y-3"
        >
          <div className="flex items-start space-x-2">
            <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none p-5 shadow-sm w-full">
              <div className="space-y-3">
                <div className="h-2 bg-slate-100 rounded-full w-3/4 animate-pulse" />
                <div className="h-2 bg-slate-100 rounded-full animate-pulse" />
                <div className="h-2 bg-slate-100 rounded-full w-5/6 animate-pulse" />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
