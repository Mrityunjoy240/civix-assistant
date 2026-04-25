'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { chatAction } from '@/app/actions/chat';
import { US_STATES_ELECTION_DATA } from '@/lib/constants';
import { findStateData, getNextDeadline, getDeadlinesForState } from '@/lib/deadline-engine';
import { parseLocation } from '@/lib/location-parser';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import DeadlineWidget from './DeadlineWidget';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Download, LayoutDashboard, MessageSquare, Settings, Menu, X } from 'lucide-react';
import VoterToolkit from './VoterToolkit';
import confetti from 'canvas-confetti';
import CivicQuiz from './CivicQuiz';
import JourneyNavigator from './JourneyNavigator';
import VoterCardGuide from './VoterCardGuide';

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
  const [showMobileToolkit, setShowToolkit] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const steps = [
    { id: 'register', label: 'Register', isCompleted: location !== null },
    { id: 'prepare', label: 'Prepare', isCompleted: location !== null && messages.some(m => 
        m.role === 'user' && (m.content.toLowerCase().includes('deadline') || m.content.toLowerCase().includes('ballot'))
      ) 
    },
    { id: 'vote', label: 'Vote', isCompleted: location !== null && messages.some(m => 
        m.role === 'user' && (m.content.toLowerCase().includes('vote') || m.content.toLowerCase().includes('voted'))
      ) 
    }
  ];

  useEffect(() => {
    const newlyCompleted = steps.filter(s => s.isCompleted && !completedSteps.has(s.id));
    if (newlyCompleted.length > 0) {
      const nextSet = new Set(completedSteps);
      newlyCompleted.forEach(s => nextSet.add(s.id));
      setCompletedSteps(nextSet);
      if (nextSet.size === 3) {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#3b82f6', '#10b981', '#ef4444'] });
      }
    }
  }, [messages, location]);

  const handleExport = () => {
    if (messages.length === 0) return;
    const text = messages.map(m => `[${m.role.toUpperCase()}]\n${m.content}\n`).join('\n---\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `civix-plan-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  };

  const handleSend = async (content: string, imageData?: string, imageType?: string) => {
    const userMessage: Message = { id: Date.now().toString(), role: 'user', content, image: imageData, imageType: imageType };
    setMessages(prev => [...prev, userMessage]);
    const detectedLocation = parseLocation(content);
    if (detectedLocation?.state) setLocation(detectedLocation);

    startTransition(async () => {
      const result = await chatAction([...messages, userMessage].map(m => ({ 
        role: m.role, content: m.content, image: m.image, imageType: m.imageType 
      })), detectedLocation || location, language);
      if (result.response) {
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: result.response! }]);
      }
    });
  };

  const stateData = location?.state ? findStateData(location.state, US_STATES_ELECTION_DATA) : null;
  const deadlines = stateData ? getDeadlinesForState(stateData) : [];
  const nextDeadline = stateData ? getNextDeadline(stateData) : null;

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans selection:bg-primary-100">
      
      {/* 1. LEFT RAIL (Desktop Nav) */}
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-slate-200">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-10">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-primary-100 ring-4 ring-primary-50">
              <span className="text-lg font-black italic">C</span>
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-slate-800 leading-none">Civix</h1>
              <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Global Election Guide</p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-5">User Journey</h4>
              <div className="space-y-4">
                {steps.map((step) => (
                  <div key={step.id} className="flex items-center group cursor-default">
                    <div className={cn(
                      "w-7 h-7 rounded-xl flex items-center justify-center text-[10px] font-bold transition-all duration-500",
                      step.isCompleted 
                        ? "bg-green-500 text-white shadow-lg shadow-green-100 scale-110" 
                        : "bg-slate-50 text-slate-400 border border-slate-100 group-hover:border-primary-200"
                    )}>
                      {step.isCompleted ? '✓' : step.label.charAt(0)}
                    </div>
                    <span className={cn(
                      "ml-3 text-xs font-bold transition-colors duration-500",
                      step.isCompleted ? "text-slate-900" : "text-slate-400"
                    )}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto p-6 border-t border-slate-50">
          <div className="bg-slate-900 rounded-[1.25rem] p-4 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/20 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <p className="text-[10px] font-bold text-primary-300 uppercase tracking-widest mb-1">PROMPTWARS 2026</p>
            <p className="text-[11px] font-medium leading-relaxed opacity-80 line-clamp-2">Reimagining civic engagement with Gemini.</p>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CENTER (Chat Engine) */}
      <main className="flex-1 flex flex-col min-w-0 bg-white lg:m-2 lg:rounded-[2.5rem] lg:border border-slate-200/50 lg:shadow-[0_40px_100px_-30px_rgba(0,0,0,0.08)] overflow-hidden relative">
        
        {/* Dynamic Chat Canvas */}
        <JourneyNavigator steps={steps} />
        
        <div className="flex-1 overflow-y-auto px-4 md:px-8 scroll-smooth custom-scrollbar bg-white/50" ref={scrollRef}>
          <div className="max-w-3xl mx-auto py-8">
            {completedSteps.size === 3 && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-10 p-6 bg-gradient-to-br from-primary-600 to-primary-900 rounded-[2rem] text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10 text-center">
                  <h3 className="text-2xl font-black mb-1 tracking-tight">Passport Ready! 🗳️</h3>
                  <p className="text-primary-100 text-xs font-medium mb-6 max-w-sm mx-auto opacity-90">All details gathered. You are fully prepared to participate.</p>
                  <button onClick={handleExport} className="bg-white text-primary-700 text-[10px] font-black px-6 py-3.5 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all uppercase tracking-widest">
                    DOWNLOAD SUMMARY CARD
                  </button>
                </div>
              </motion.div>
            )}
            <MessageList messages={messages} loading={isPending} />
          </div>
        </div>

        {/* Professional Input Dock */}
        <div className="px-4 md:px-8 pb-6 pt-2 bg-white/80 backdrop-blur-md border-t border-slate-50 sticky bottom-0">
          <div className="max-w-3xl mx-auto">
            <ChatInput onSend={handleSend} disabled={isPending} />
            <div className="flex items-center justify-between mt-4 px-2">
               <p className="text-[8px] text-slate-400 font-bold tracking-[0.1em] uppercase opacity-40">
                Civix Non-Partisan Protocol • Educational Data
              </p>
              <div className="flex space-x-2">
                {(['English', 'Hindi', 'Bengali'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={cn(
                      "text-[8px] font-black uppercase tracking-widest transition-all",
                      language === lang ? "text-primary-600" : "text-slate-300 hover:text-slate-500"
                    )}
                  >
                    {lang === 'Hindi' ? 'हिन्दी' : lang === 'Bengali' ? 'বাংলা' : 'EN'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 3. COMMAND CENTER (Right Rail) */}
      <aside className="hidden xl:flex w-[21rem] flex-col bg-[#F8FAFC] p-6 overflow-y-auto gap-6 border-l border-slate-100">
        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Command Center</h4>
        
        {deadlines.length > 0 ? (
          <DeadlineWidget locationName={location?.state} deadlines={deadlines} nextDeadline={nextDeadline} />
        ) : (
          <div className="p-6 bg-white rounded-[2rem] border border-slate-100 text-center shadow-sm">
            <LayoutDashboard className="w-8 h-8 text-slate-100 mx-auto mb-4" />
            <p className="text-[11px] text-slate-400 font-bold leading-relaxed">
              Activate real-time tracking via location.
            </p>
          </div>
        )}
        
        <div className="space-y-4">
          <VoterToolkit />
          <VoterCardGuide />
          <CivicQuiz />
        </div>
      </aside>

      {/* MOBILE FAB & DRAWER */}
      <button 
        onClick={() => setShowToolkit(true)}
        className="lg:hidden fixed bottom-24 right-4 w-11 h-11 bg-slate-900 text-white rounded-xl shadow-2xl flex items-center justify-center z-40 hover:scale-110 active:scale-95 transition-all"
      >
        <LayoutDashboard className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {showMobileToolkit && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowToolkit(false)} className="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]" />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="lg:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-[3rem] p-8 pb-12 z-[101] max-h-[85vh] overflow-y-auto shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
              <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-8" />
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black text-slate-800">Command Center</h3>
                <button onClick={() => setShowToolkit(false)} className="p-2 bg-slate-100 rounded-full text-slate-400"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-8">
                {deadlines.length > 0 && <DeadlineWidget locationName={location?.state} deadlines={deadlines} nextDeadline={nextDeadline} />}
                <VoterToolkit />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
