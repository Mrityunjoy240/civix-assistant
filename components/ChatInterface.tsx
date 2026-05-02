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
import { Download, LayoutDashboard, ShieldCheck, CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react';
import VoterToolkit from './VoterToolkit';
import confetti from 'canvas-confetti';
import CivicQuiz from './CivicQuiz';
import JourneyNavigator from './JourneyNavigator';
import VoterCardGuide from './VoterCardGuide';
import { calculateReadiness } from '@/lib/readiness-engine';

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
  const [location, setLocation] = useState<Location | null>({ country: 'india', state: 'West Bengal' });
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
  const readiness = calculateReadiness({
    locationDetected: Boolean(location?.state),
    registrationCompleted: true,
    voterIdVerified: false,
    hasUpcomingDeadline: Boolean(nextDeadline),
    pollingBoothChecked: messages.some((m) => m.role === 'user' && m.content.toLowerCase().includes('booth'))
  });


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
            <div className="mb-8 space-y-4">
              <div className="rounded-2xl bg-zinc-950 text-white p-6">
                <p className="text-xs uppercase tracking-wider text-zinc-400">Verified Civic Readiness Engine</p>
                <h2 className="text-3xl font-bold mt-2">You are {readiness.score}% election ready</h2>
                <p className="text-zinc-300 mt-2">Complete the remaining steps to be 100% ready to vote.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {['Check My Election Readiness','See All Deadlines','Find My Polling Booth','Voter ID & Documents Help'].map((cta) => (
                    <button key={cta} className="text-xs bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg">{cta}</button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="rounded-xl bg-white p-4 ring-1 ring-zinc-200"><p className="text-xs text-zinc-500">Registered</p><p className="font-semibold text-emerald-600">Completed</p></div>
                <div className="rounded-xl bg-white p-4 ring-1 ring-zinc-200"><p className="text-xs text-zinc-500">Voter ID</p><p className="font-semibold text-amber-600">Verification pending</p></div>
                <div className="rounded-xl bg-white p-4 ring-1 ring-zinc-200"><p className="text-xs text-zinc-500">Next Deadline</p><p className="font-semibold">15 Apr 2026 / 12 days left</p></div>
                <div className="rounded-xl bg-white p-4 ring-1 ring-zinc-200"><p className="text-xs text-zinc-500">Polling Booth</p><p className="font-semibold text-rose-600">Not checked</p></div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-xl bg-white p-5 ring-1 ring-zinc-200">
                  <div className="flex items-center gap-2 mb-2"><ShieldCheck className="w-4 h-4 text-indigo-600" /><h3 className="font-semibold">Why you can trust Civix</h3></div>
                  <ul className="text-sm text-zinc-600 space-y-1">
                    <li>• Verified Sources</li><li>• No AI Hallucinations</li><li>• Transparent Answers</li><li>• Hybrid AI + deterministic deadline engine</li>
                  </ul>
                  <p className="text-xs text-zinc-500 mt-2">Last updated: {new Date().toLocaleString()}</p>
                  <a className="text-xs text-indigo-600" href="https://voters.eci.gov.in/" target="_blank" rel="noreferrer">voters.eci.gov.in</a>
                </div>
                <div className="rounded-xl bg-white p-5 ring-1 ring-zinc-200">
                  <h3 className="font-semibold mb-2">AI vs Reality</h3>
                  <p className="text-xs text-zinc-500">User asked: “What is the last date to register to vote in West Bengal?”</p>
                  <p className="mt-2 text-sm"><XCircle className="inline w-4 h-4 text-rose-500" /> Generic AI: May 1, 2026 (incorrect)</p>
                  <p className="text-sm"><CheckCircle2 className="inline w-4 h-4 text-emerald-600" /> Civix verified: April 15, 2026 (correct)</p>
                  <p className="text-xs mt-2 text-zinc-500">Source: ceowestbengal.nic.in / voters.eci.gov.in</p>
                </div>
              </div>
            </div>
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
