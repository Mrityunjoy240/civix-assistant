'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Deadline {
  type: string;
  display: string;
  urgency: 'critical' | 'soon' | 'comfortable' | 'passed';
}

interface DeadlineWidgetProps {
  locationName?: string;
  deadlines: Deadline[];
  nextDeadline?: Deadline | null;
}

export default function DeadlineWidget({ locationName, deadlines, nextDeadline }: DeadlineWidgetProps) {
  if (deadlines.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "rounded-2xl p-5 mb-6 glass relative overflow-hidden",
        nextDeadline?.urgency === 'critical' ? "ring-2 ring-red-500/50" : "ring-1 ring-slate-200"
      )}
    >
      {nextDeadline?.urgency === 'critical' && (
        <div className="absolute top-0 right-0 p-2">
          <AlertCircle className="w-5 h-5 text-red-500 animate-pulse" />
        </div>
      )}

      <div className="flex items-center space-x-2 mb-4">
        <Calendar className="w-5 h-5 text-primary-600" />
        <h3 className="font-bold text-slate-800">Deadlines for {locationName}</h3>
      </div>

      <div className="space-y-3">
        {deadlines.map((deadline, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <span className="text-slate-600 flex items-center">
              <Clock className="w-4 h-4 mr-2 text-slate-400" />
              {deadline.type}
            </span>
            <span className={cn(
              "font-semibold px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider",
              deadline.urgency === 'critical' && "bg-red-100 text-red-700",
              deadline.urgency === 'soon' && "bg-orange-100 text-orange-700",
              deadline.urgency === 'comfortable' && "bg-green-100 text-green-700",
              deadline.urgency === 'passed' && "bg-slate-100 text-slate-500"
            )}>
              {deadline.display}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
