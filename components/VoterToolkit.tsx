'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, CheckSquare, NotebookPen, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function VoterToolkit() {
  const [notes, setNotes] = useState('');
  const [checklist, setChecklist] = useState([
    { id: 1, task: 'Voter ID (EPIC Card)', checked: false },
    { id: 2, task: 'Voter Information Slip', checked: false },
    { id: 3, task: 'Check Polling Station Address', checked: false },
    { id: 4, task: 'Verify name in Voter List', checked: false },
  ]);

  // Load notes from localStorage on mount
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
    <div className="space-y-6">
      {/* 1. Document Checklist */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
        <div className="flex items-center space-x-2 mb-4">
          <CheckSquare className="w-5 h-5 text-primary-600" />
          <h3 className="font-bold text-slate-800 text-sm">Voter's Checklist</h3>
        </div>
        <div className="space-y-3">
          {checklist.map(item => (
            <button
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className="flex items-center space-x-3 w-full text-left group"
            >
              <div className={cn(
                "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                item.checked ? "bg-green-500 border-green-500" : "border-slate-300 group-hover:border-primary-400"
              )}>
                {item.checked && <span className="text-white text-[10px]">✓</span>}
              </div>
              <span className={cn(
                "text-xs font-medium",
                item.checked ? "text-slate-400 line-through" : "text-slate-600"
              )}>
                {item.task}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Ballot Notepad (Privacy First) */}
      <div className="bg-primary-50/50 rounded-2xl p-5 border border-primary-100 shadow-sm">
        <div className="flex items-center space-x-2 mb-3">
          <NotebookPen className="w-5 h-5 text-primary-600" />
          <h3 className="font-bold text-slate-800 text-sm">Ballot Notepad</h3>
        </div>
        <p className="text-[10px] text-primary-600 mb-3 flex items-center">
          <Info className="w-3 h-3 mr-1" />
          Private: Saved only on this device.
        </p>
        <textarea
          value={notes}
          onChange={(e) => handleNoteChange(e.target.value)}
          placeholder="Write down candidates or notes to remember..."
          className="w-full bg-white border border-primary-200 rounded-xl p-3 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/30 min-h-[100px] resize-none"
        />
      </div>

      {/* 3. Emergency SOS */}
      <div className="bg-red-50 rounded-2xl p-5 border border-red-100">
        <div className="flex items-center space-x-2 mb-3 text-red-700">
          <ShieldAlert className="w-5 h-5" />
          <h3 className="font-bold text-sm">Facing Trouble?</h3>
        </div>
        <p className="text-[10px] text-red-600 mb-4 leading-relaxed">
          If you are intimidated, blocked, or turned away at the booth, call the helpline immediately.
        </p>
        <a 
          href="tel:1950"
          className="block w-full bg-red-600 text-white text-center py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-red-500/20 hover:bg-red-700 transition-colors"
        >
          CALL ECI HELPLINE (1950)
        </a>
      </div>
    </div>
  );
}
