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
    if (activeStepIdx === 0) return "Start by identifying your location or uploading a Voter ID.";
    if (activeStepIdx === 1) return "Check your local deadlines and understand your ballot.";
    if (activeStepIdx === 2 && !steps[2].isCompleted) return "Find your polling booth and check the live queue status.";
    return "Your journey is complete! You are ready to vote.";
  };

  return (
    <div className="bg-white border-b border-slate-100 px-6 py-4 sticky top-0 z-20 backdrop-blur-md bg-white/90">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, i) => (
            <div key={step.id} className="flex-1 flex items-center">
              <div className="flex flex-col items-center relative z-10">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-500",
                  step.isCompleted ? "bg-green-500 text-white shadow-lg" : 
                  i === activeStepIdx ? "bg-primary-600 text-white scale-110 shadow-primary-200 shadow-xl" : "bg-slate-100 text-slate-400"
                )}>
                  {step.isCompleted ? '✓' : i + 1}
                </div>
                <span className={cn(
                  "mt-2 text-[9px] font-bold uppercase tracking-widest",
                  i === activeStepIdx ? "text-primary-600" : "text-slate-400"
                )}>
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 h-[2px] mx-2 -mt-4 bg-slate-100 relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: step.isCompleted ? "100%" : "0%" }}
                    className="h-full bg-green-500"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        
        <motion.div 
          key={activeStepIdx}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary-50 rounded-xl px-4 py-2.5 flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <span className="text-primary-600">
              {activeStepIdx === 0 && <Flag className="w-3.5 h-3.5" />}
              {activeStepIdx === 1 && <Calendar className="w-3.5 h-3.5" />}
              {activeStepIdx >= 2 && <Vote className="w-3.5 h-3.5" />}
            </span>
            <p className="text-[10px] font-bold text-primary-700 uppercase tracking-tight">
              {getRecommendation()}
            </p>
          </div>
          <ArrowRight className="w-3 h-3 text-primary-400" />
        </motion.div>
      </div>
    </div>
  );
}
