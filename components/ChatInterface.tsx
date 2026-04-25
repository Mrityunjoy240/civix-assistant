'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { chatAction } from '@/app/actions/chat';
import { SUGGESTED_ENTRY_FLOWS, US_STATES_ELECTION_DATA } from '@/lib/constants';
import { findStateData, getNextDeadline, getDeadlinesForState } from '@/lib/deadline-engine';
import { parseLocation } from '@/lib/location-parser';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import DeadlineWidget from './DeadlineWidget';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Download } from 'lucide-react';
import VoterToolkit from './VoterToolkit';
import confetti from 'canvas-confetti';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  imageType?: string;
}

interface Location {
  country: string;
  state?: string;
  county?: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [location, setLocation] = useState<Location | null>(null);
  const [language, setLanguage] = useState<'English' | 'Hindi' | 'Bengali'>('English');
  const [isPending, startTransition] = useTransition();
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isPending]);

  const checkProgress = () => {
    const steps = [
      { id: 'register', isCompleted: location !== null },
      { id: 'prepare', isCompleted: location !== null && messages.some(m => 
          m.role === 'user' && (m.content.toLowerCase().includes('deadline') || m.content.toLowerCase().includes('ballot'))
        ) 
      },
      { id: 'vote', isCompleted: location !== null && messages.some(m => 
          m.role === 'user' && (m.content.toLowerCase().includes('vote') || m.content.toLowerCase().includes('polling'))
        ) 
      }
    ];

    const newlyCompleted = steps.filter(s => s.isCompleted && !completedSteps.has(s.id));
    if (newlyCompleted.length > 0) {
      const nextSet = new Set(completedSteps);
      newlyCompleted.forEach(s => nextSet.add(s.id));
      setCompletedSteps(nextSet);

      if (nextSet.size === 3) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#3b82f6', '#10b981', '#ef4444']
        });
      }
    }
    return steps;
  };

  useEffect(() => {
    checkProgress();
  }, [messages, location]);

  const handleExport = () => {
    if (messages.length === 0) return;
    
    const text = messages.map(m => `[${m.role.toUpperCase()}]\n${m.content}\n`).join('\n---\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `civix-chat-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSend = async (content: string, imageData?: string, imageType?: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      image: imageData,
      imageType: imageType
    };
    
    setMessages(prev => [...prev, userMessage]);

    const detectedLocation = parseLocation(content);
    let updatedLocation = location;
    if (detectedLocation && detectedLocation.state) {
      updatedLocation = detectedLocation;
      setLocation(detectedLocation);
    }

    startTransition(async () => {
      const result = await chatAction(
        [...messages, userMessage].map(m => ({ 
          role: m.role, 
          content: m.content,
          image: m.image,
          imageType: m.imageType 
        })),
        updatedLocation,
        language
      );

      if (result.response) {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: result.response!
        }]);
      } else if (result.error) {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.'
        }]);
      }
    });
  };

  const getDeadlineInfo = () => {
    if (!location?.state) return null;
    const stateData = findStateData(location.state, US_STATES_ELECTION_DATA);
    if (!stateData) return null;
    
    const deadlines = getDeadlinesForState(stateData);
    const nextDeadline = getNextDeadline(stateData);
    
    return { deadlines, nextDeadline, stateData };
  };

  const deadlineInfo = getDeadlineInfo();

  return (
    <div className="max-w-5xl mx-auto h-[92vh] flex flex-col relative bg-white/50 rounded-3xl border border-slate-200/60 shadow-2xl shadow-slate-200/50 backdrop-blur-sm overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 md:px-8 scroll-smooth" ref={scrollRef}>
        <div className="py-8">
          <header className="mb-10 text-center relative">
            <div className="absolute top-0 left-0">
              <div className="flex bg-slate-100/80 p-1 rounded-xl border border-slate-200">
                {(['English', 'Hindi', 'Bengali'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={cn(
                      "px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all",
                      language === lang 
                        ? "bg-white text-primary-600 shadow-sm" 
                        : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    {lang === 'Hindi' ? 'हिन्दी' : lang === 'Bengali' ? 'বাংলা' : 'EN'}
                  </button>
                ))}
              </div>
            </div>
            <div className="absolute top-0 right-0 flex space-x-2">
              <AnimatePresence>
                {messages.length > 0 && (
                  <>
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={handleExport}
                      className="flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-primary-600 transition-colors p-2"
                      title="Export conversation"
                    >
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">EXPORT</span>
                    </motion.button>
                  </>
                )}
              </AnimatePresence>
            </div>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-block p-3 bg-primary-600 rounded-2xl text-white text-3xl mb-4 shadow-xl shadow-primary-500/30"
            >
              🗳️
            </motion.div>
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl font-black text-slate-900 tracking-tight mb-2"
            >
              Civix
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-slate-500 font-medium"
            >
              Your personal election guide
            </motion.p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              {completedSteps.size === 3 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-8 p-6 bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl text-white shadow-xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                    >
                      <Download className="w-32 h-32" />
                    </motion.div>
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-2xl font-black mb-2">You're Ready to Vote! 🗳️</h3>
                    <p className="text-primary-100 text-sm mb-6">Your personalized voting passport is ready based on our session.</p>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                        <p className="text-[10px] uppercase font-bold text-primary-200 mb-1">Jurisdiction</p>
                        <p className="text-sm font-bold truncate">{location?.state || 'Verified'}</p>
                      </div>
                      <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                        <p className="text-[10px] uppercase font-bold text-primary-200 mb-1">Language</p>
                        <p className="text-sm font-bold">{language}</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleExport}
                      className="w-full bg-white text-primary-700 font-bold py-3 rounded-xl hover:bg-primary-50 transition-colors shadow-lg shadow-black/20"
                    >
                      Download My Voting Plan
                    </button>
                  </div>
                </motion.div>
              )}
              
              <div className="bg-slate-50/50 rounded-3xl border border-slate-100 overflow-hidden">
                <MessageList messages={messages} loading={isPending} />
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="sticky top-0">
                <AnimatePresence mode="wait">
                  {deadlineInfo ? (
                    <DeadlineWidget 
                      locationName={location?.state}
                      deadlines={deadlineInfo.deadlines}
                      nextDeadline={deadlineInfo.nextDeadline}
                    />
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center"
                    >
                      <p className="text-sm text-slate-400">
                        Tell me your state to see upcoming election deadlines.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm mt-6">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Your Progress</h4>
                  <div className="space-y-4">
                    {[
                      { 
                        label: 'Register', 
                        isCompleted: location !== null 
                      },
                      { 
                        label: 'Prepare', 
                        isCompleted: location !== null && messages.some(m => 
                          m.role === 'user' && (
                            m.content.toLowerCase().includes('deadline') || 
                            m.content.toLowerCase().includes('ballot') || 
                            m.content.toLowerCase().includes('learn') ||
                            m.content.toLowerCase().includes('registration')
                          )
                        ) 
                      },
                      { 
                        label: 'Vote', 
                        isCompleted: location !== null && messages.some(m => 
                          m.role === 'user' && (
                            m.content.toLowerCase().includes('vote') || 
                            m.content.toLowerCase().includes('voted') || 
                            m.content.toLowerCase().includes('polling') || 
                            m.content.toLowerCase().includes('where') ||
                            m.content.toLowerCase().includes('how') ||
                            m.content.toLowerCase().includes('done')
                          )
                        ) 
                      }
                    ].map((step, i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors duration-500",
                          step.isCompleted ? "bg-green-500 text-white" : "bg-slate-100 text-slate-400"
                        )}>
                          {step.isCompleted ? '✓' : i + 1}
                        </div>
                        <span className={cn(
                          "text-sm font-medium transition-colors duration-500",
                          step.isCompleted ? "text-slate-900" : "text-slate-400"
                        )}>
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <VoterToolkit />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 bg-transparent">
        <ChatInput onSend={handleSend} disabled={isPending} />
        <p className="text-[10px] text-center text-slate-400 mt-4 px-12">
          Civix provides general civic education. Always verify details with your official state or local election authority.
        </p>
      </div>
    </div>
  );
}
