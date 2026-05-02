'use client';

import { Calendar, MapPin, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Deadline {
  type?: string;
  display?: string;
  urgency?: 'critical' | 'soon' | 'comfortable' | 'passed';
  name?: string;
  date?: string;
}

interface DeadlineWidgetProps {
  locationName?: string;
  deadlines: Deadline[];
  nextDeadline?: Deadline | null;
}

export default function DeadlineWidget({ locationName, deadlines, nextDeadline }: DeadlineWidgetProps) {
  if (deadlines.length === 0) return null;

  return (
    <div className="rounded-2xl p-5 bg-white ring-1 ring-zinc-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-600" />
          <h3 className="font-semibold text-sm">Deadlines</h3>
        </div>
        <div className="flex items-center gap-2">
          <button title="Share to WhatsApp" className="p-2 rounded-lg bg-green-50 text-green-700"><Share2 className="w-4 h-4" /></button>
          <span className="text-xs text-zinc-500">{locationName ?? 'Your location'}</span>
        </div>
      </div>
      <div className="space-y-3">
        {deadlines.map((deadline, idx) => {
          const type = deadline.type ?? deadline.name ?? 'Deadline';
          const display = deadline.display ?? deadline.date ?? '';
          const urgency = deadline.urgency ?? 'comfortable';
          const isNext = (nextDeadline?.type ?? nextDeadline?.name) === type;
          return (
            <div key={idx} className="flex gap-3 items-start">
              <div className={cn('mt-1 h-2.5 w-2.5 rounded-full', urgency === 'critical' ? 'bg-rose-500' : urgency === 'soon' ? 'bg-amber-500' : urgency === 'passed' ? 'bg-zinc-300' : 'bg-emerald-500')} />
              <div className="flex-1">
                <p className="text-xs text-zinc-500">{type}</p>
                <p className="text-sm font-medium">{display} {isNext ? '• You are here' : ''}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 pt-4 border-t border-zinc-100 flex items-start gap-2 text-xs text-zinc-600">
        <MapPin className="w-4 h-4 text-indigo-600 mt-0.5" />
        Next action: Verify your polling booth and keep your voter ID ready.
      </div>
    </div>
  );
}
