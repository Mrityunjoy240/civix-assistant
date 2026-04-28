'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, ExternalLink, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function VoterCardGuide() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg ring-1 ring-zinc-200 shadow-sm overflow-hidden transition-all">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-white hover:bg-zinc-50 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <CreditCard className="w-5 h-5 text-zinc-700" />
          <h3 className="font-semibold text-zinc-900 text-sm">Voter ID Guide</h3>
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
            <div className="p-4 border-t border-zinc-100 space-y-5">
              {/* Front of Card (EPIC) */}
              <div>
                <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-2">Front Side</p>
                <div className="relative w-full aspect-[2/1] bg-zinc-50 ring-1 ring-inset ring-zinc-200 rounded-md p-3">
                   <div className="w-6 h-8 bg-zinc-200 rounded-sm mb-2" />
                   <div className="space-y-1">
                     <div className="h-1 w-12 bg-zinc-200 rounded-full" />
                     <div className="h-1 w-16 bg-zinc-200 rounded-full" />
                   </div>
                   <motion.div 
                     animate={{ scale: [1, 1.05, 1] }} 
                     transition={{ repeat: Infinity, duration: 2 }}
                     className="absolute top-2 right-2 px-1.5 py-0.5 bg-zinc-900 text-white rounded text-[8px] font-semibold shadow-sm"
                   >
                     EPIC: UPM256...
                   </motion.div>
                </div>
              </div>

              {/* Back of Card (Part Num) */}
              <div>
                <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-2">Back Side (Bottom)</p>
                <div className="relative w-full aspect-[2/1] bg-zinc-50 ring-1 ring-inset ring-zinc-200 rounded-md p-3">
                   <div className="space-y-1.5 mt-3">
                     <div className="h-1 w-full bg-zinc-200 rounded-full" />
                     <div className="h-1 w-full bg-zinc-200 rounded-full" />
                     <div className="h-1 w-2/3 bg-zinc-200 rounded-full" />
                   </div>
                   <motion.div 
                     animate={{ scale: [1, 1.05, 1] }} 
                     transition={{ repeat: Infinity, duration: 2, delay: 1 }}
                     className="absolute bottom-2 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-zinc-900 text-white rounded text-[8px] font-semibold shadow-sm"
                   >
                     Part No: 85/402
                   </motion.div>
                </div>
                
                <div className="mt-3 p-3 bg-zinc-50 rounded-md ring-1 ring-inset ring-zinc-200/50">
                  <p className="text-[10px] text-zinc-600 leading-relaxed">
                    <span className="font-semibold text-zinc-900">Can't find it?</span> Part numbers are often not printed on old cards. Find yours online using your EPIC number.
                  </p>
                  <a 
                    href="https://electoralsearch.eci.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 flex items-center justify-center space-x-1 w-full bg-white ring-1 ring-inset ring-zinc-300 py-1.5 rounded text-[10px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors shadow-sm"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Search Portal</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
