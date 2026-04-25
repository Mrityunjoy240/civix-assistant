'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

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
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-3xl mb-4">
            🗳️
          </div>
          <h2 className="text-xl font-semibold mb-2">Welcome to Civix</h2>
          <p className="text-slate-500 max-w-sm">
            I help you understand and navigate elections. Ask me anything about registration, deadlines, or voting.
          </p>
        </motion.div>
      )}

      {messages.map((message) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, x: message.role === 'user' ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={cn(
            "flex flex-col max-w-[85%] rounded-2xl px-5 py-3.5 shadow-sm transition-all",
            message.role === 'user' 
              ? "ml-auto bg-primary-600 text-white rounded-tr-none shadow-primary-500/10" 
              : "mr-auto bg-white border border-slate-100 rounded-tl-none shadow-slate-200/50 text-slate-800"
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
              {message.content}
            </ReactMarkdown>
          </div>
        </motion.div>
      ))}

      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mr-auto bg-white border border-slate-100 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center space-x-2"
        >
          <div className="flex space-x-1">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="w-2 h-2 bg-slate-300 rounded-full"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
              className="w-2 h-2 bg-slate-300 rounded-full"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
              className="w-2 h-2 bg-slate-300 rounded-full"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
