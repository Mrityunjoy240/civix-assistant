'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Flag, Calendar, Vote, ArrowRight } from 'lucide-react';

interface JourneyNavigatorProps {
  steps: { id: string; label: string; isCompleted: boolean }[];
}

export default function JourneyNavigator({ steps }: JourneyNavigatorProps) {
  const currentStepIdx = steps.findIndex(s => !s.isCompleted);
  const activeStepIdx = currentStepIdx === -1 ? 2 : currentStepIdx;

  const getRecommendation = () => {
    if (activeStepIdx === 0) return "Identify your location to start.";
    if (activeStepIdx === 1) return "Check deadlines and ballot details.";
    if (activeStepIdx === 2 && !steps[2].isCompleted) return "Find booth and check queue status.";
    return "You are fully prepared to vote!";
  };

  return (
    <div className="bg-white/90 border-b border-slate-100 px-6 md:px-10 py-5 sticky top-0 z-20 backdrop-blur-xl">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-5 relative">
          {/* Background Progress Line */}
          <div className="absolute top-4 left-0 right-0 h-[2px] bg-slate-100 -z-10" />
          
          {steps.map((step, i) => (
            <div key={step.id} className="flex-1 flex flex-col items-center relative">
              <div className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black transition-all duration-700 z-10",
                step.isCompleted ? "bg-green-500 text-white shadow-lg shadow-green-100" : 
                i === activeStepIdx ? "bg-primary-600 text-white scale-110 shadow-xl shadow-primary-100" : "bg-white text-slate-400 border-2 border-slate-100"
              )}>
                {step.isCompleted ? '✓' : i + 1}
              </div>
              <span className={cn(
                "mt-2 text-[10px] font-black uppercase tracking-widest transition-colors duration-500",
                i === activeStepIdx ? "text-primary-600" : "text-slate-400"
              )}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
        
        <motion.div 
          key={activeStepIdx}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-50 rounded-2xl px-5 py-3 flex items-center justify-between border border-slate-100/50"
        >
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center shadow-sm text-primary-600">
              {activeStepIdx === 0 && <Flag className="w-3.5 h-3.5" />}
              {activeStepIdx === 1 && <Calendar className="w-3.5 h-3.5" />}
              {activeStepIdx >= 2 && <Vote className="w-3.5 h-3.5" />}
            </div>
            <p className="text-[11px] font-bold text-slate-600">
              {getRecommendation()}
            </p>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
        </motion.div>
      </div>
    </div>
  );
}
