'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, CheckSquare, NotebookPen, Info, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function VoterToolkit() {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [checklist, setChecklist] = useState([
    { id: 1, task: 'Voter ID (EPIC Card)', checked: false },
    { id: 2, task: 'Voter Information Slip', checked: false },
    { id: 3, task: 'Check Polling Station Address', checked: false },
    { id: 4, task: 'Verify name in Voter List', checked: false },
  ]);

  useEffect(() => {
    const savedNotes = localStorage.getItem('civix_ballot_notes');
    if (savedNotes) setNotes(savedNotes);
  }, []);

  const handleNoteChange = (val: string) => {
    setNotes(val);
    localStorage.setItem('civix_ballot_notes', val);
  };

  const toggleCheck = (id: number) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  return (
    <div className="bg-white rounded-lg ring-1 ring-zinc-200 shadow-sm overflow-hidden transition-all">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-white hover:bg-zinc-50 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <CheckSquare className="w-5 h-5 text-zinc-700" />
          <h3 className="font-semibold text-zinc-900 text-sm">Voter's Toolkit</h3>
        </div>
        <ChevronDown className={cn("w-4 h-4 text-zinc-400 transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4 border-t border-zinc-100 space-y-6">
              {/* 1. Document Checklist */}
              <div>
                <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-3">Checklist</p>
                <div className="space-y-3">
                  {checklist.map(item => (
                    <button
                      key={item.id}
                      onClick={() => toggleCheck(item.id)}
                      className="flex items-center space-x-3 w-full text-left group"
                    >
                      <div className={cn(
                        "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                        item.checked ? "bg-zinc-900 border-zinc-900" : "border-zinc-300 group-hover:border-zinc-400 bg-white"
                      )}>
                        {item.checked && <span className="text-white text-[10px]">✓</span>}
                      </div>
                      <span className={cn(
                        "text-xs font-medium transition-colors",
                        item.checked ? "text-zinc-400 line-through" : "text-zinc-700"
                      )}>
                        {item.task}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Ballot Notepad (Privacy First) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Notepad</p>
                  <span className="text-[9px] text-zinc-400 flex items-center">
                    <Info className="w-3 h-3 mr-1" /> Private
                  </span>
                </div>
                <textarea
                  value={notes}
                  onChange={(e) => handleNoteChange(e.target.value)}
                  placeholder="Notes to remember..."
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-md p-3 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-900 min-h-[80px] resize-none placeholder:text-zinc-400"
                />
              </div>

              {/* 3. Emergency SOS */}
              <div className="bg-red-50 rounded-md p-4 ring-1 ring-inset ring-red-100">
                <div className="flex items-center space-x-2 mb-2 text-red-700">
                  <ShieldAlert className="w-4 h-4" />
                  <h3 className="font-semibold text-xs">Facing Trouble?</h3>
                </div>
                <p className="text-[10px] text-red-600 mb-3 leading-relaxed">
                  If you are intimidated or turned away, call the helpline immediately.
                </p>
                <a 
                  href="tel:1950"
                  className="block w-full bg-red-600 text-white text-center py-2 rounded text-xs font-semibold hover:bg-red-700 transition-colors shadow-sm"
                >
                  Call ECI Helpline (1950)
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
