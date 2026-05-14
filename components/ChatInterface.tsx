'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, X } from 'lucide-react';
import { cn } from '@/lib/utils/utils';
import { useChatEngine } from '@/features/chat/hooks/useChatEngine';

import MessageList from './MessageList';
import ChatInput from './ChatInput';
import DeadlineWidget from './DeadlineWidget';
import VoterToolkit from './VoterToolkit';
import CivicQuiz from './CivicQuiz';
import JourneyNavigator from './JourneyNavigator';
import VoterCardGuide from './VoterCardGuide';

export default function ChatInterface() {
  const {
    messages,
    location,
    language,
    isPending,
    completedSteps,
    steps,
    deadlines,
    nextDeadline,
    setLanguage,
    handleExport,
    handleSend
  } = useChatEngine();

  const [showMobileToolkit, setShowToolkit] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden font-sans selection:bg-zinc-200 relative">
      
      {/* 1. LEFT RAIL (Desktop Nav) */}
      <aside className="hidden lg:flex w-64 flex-col bg-zinc-50 border-r border-zinc-200 z-10">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-10">
            <div className="w-8 h-8 bg-zinc-900 rounded-md flex items-center justify-center text-white shadow-sm ring-1 ring-inset ring-zinc-900/10">
              <span className="text-base font-bold">C</span>
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-tight text-zinc-900 leading-none">Civix</h1>
              <p className="text-[10px] font-medium text-zinc-500 mt-1 uppercase tracking-wider">Global Election Guide</p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-5">User Journey</h4>
              <div className="space-y-4">
                {steps.map((step) => (
                  <div key={step.id} className="flex items-center group cursor-default">
                    <div className={cn(
                      "w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-medium transition-all duration-200",
                      step.isCompleted 
                        ? "bg-zinc-900 text-white shadow-sm" 
                        : "bg-white text-zinc-500 ring-1 ring-inset ring-zinc-200 group-hover:bg-zinc-50"
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

        <div className="mt-auto p-6 border-t border-zinc-200">
          <div className="bg-white rounded-lg p-4 text-zinc-900 ring-1 ring-zinc-200 shadow-sm relative overflow-hidden group">
            <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-1">PROMPTWARS 2026</p>
            <p className="text-xs font-medium leading-relaxed opacity-80 line-clamp-2">Reimagining civic engagement with Gemini.</p>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CENTER (Chat Engine) */}
      <main className="flex-1 flex flex-col min-w-0 bg-white lg:m-4 lg:rounded-2xl ring-1 ring-zinc-950/5 lg:shadow-sm overflow-hidden relative z-10">
        
        {/* Dynamic Chat Canvas */}
        <JourneyNavigator steps={steps} />
        
        <div className="flex-1 overflow-y-auto px-4 md:px-8 scroll-smooth custom-scrollbar bg-white" ref={scrollRef}>
          <div className="max-w-3xl mx-auto py-8">
            {completedSteps.size === 3 && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-10 p-6 bg-zinc-900 rounded-xl text-white shadow-sm ring-1 ring-inset ring-white/10 relative overflow-hidden">
                <div className="relative z-10 text-center">
                  <h3 className="text-xl font-semibold mb-1 tracking-tight">Passport Ready! 🗳️</h3>
                  <p className="text-zinc-400 text-sm font-medium mb-6 max-w-sm mx-auto">All details gathered. You are fully prepared to participate.</p>
                  <button onClick={handleExport} className="bg-white text-zinc-900 text-xs font-semibold px-4 py-2.5 rounded-md shadow-sm hover:bg-zinc-100 transition-all">
                    Download Summary Card
                  </button>
                </div>
              </motion.div>
            )}
            <MessageList messages={messages} loading={isPending} />
          </div>
        </div>

        {/* Professional Input Dock */}
        <div className="px-4 md:px-8 pb-6 pt-2 bg-white border-t border-zinc-100 sticky bottom-0">
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
                      "text-[10px] font-bold px-2 py-1 rounded transition-all",
                      language === lang 
                        ? "bg-zinc-900 text-white shadow-sm" 
                        : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900"
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
      <aside className="hidden xl:flex w-[21rem] flex-col bg-zinc-50 p-6 overflow-y-auto gap-6 border-l border-zinc-200 z-10">
        <h4 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest ml-1">Command Center</h4>
        
        {deadlines.length > 0 ? (
          <DeadlineWidget locationName={location?.state} deadlines={deadlines} nextDeadline={nextDeadline} />
        ) : (
          <div className="p-6 bg-white rounded-lg ring-1 ring-zinc-200 text-center shadow-sm">
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
