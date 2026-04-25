'use client';

import { motion } from 'framer-motion';
import { CreditCard, Hash, Info } from 'lucide-react';

export default function VoterCardGuide() {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
      <div className="flex items-center space-x-2 mb-6">
        <CreditCard className="w-5 h-5 text-primary-600" />
        <h3 className="font-bold text-slate-800 text-sm">Voter ID Guide</h3>
      </div>

      <div className="space-y-6">
        {/* Front of Card (EPIC) */}
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Front Side</p>
          <div className="relative w-full aspect-[1.6/1] bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-3 shadow-inner">
             <div className="w-8 h-10 bg-slate-200 rounded-sm mb-2" /> {/* Photo Placeholder */}
             <div className="space-y-1">
               <div className="h-1.5 w-16 bg-slate-200 rounded-full" />
               <div className="h-1.5 w-20 bg-slate-200 rounded-full" />
             </div>
             {/* EPIC Number Label */}
             <motion.div 
               animate={{ scale: [1, 1.05, 1] }} 
               transition={{ repeat: Infinity, duration: 2 }}
               className="absolute top-3 right-3 px-2 py-1 bg-primary-600 text-white rounded text-[8px] font-bold shadow-lg"
             >
               EPIC: UPM256...
             </motion.div>
          </div>
          <p className="mt-2 text-[9px] text-slate-500 flex items-start">
            <Hash className="w-3 h-3 mr-1 mt-0.5 text-primary-500" />
            EPIC Number is the 10-digit ID on the top right.
          </p>
        </div>

        {/* Back of Card (Part Num) */}
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Back Side</p>
          <div className="relative w-full aspect-[1.6/1] bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-3 shadow-inner">
             <div className="space-y-2 mt-4">
               <div className="h-1 w-full bg-slate-200 rounded-full" />
               <div className="h-1 w-full bg-slate-200 rounded-full" />
               <div className="h-1 w-2/3 bg-slate-200 rounded-full" />
             </div>
             {/* Part Number Label */}
             <motion.div 
               animate={{ scale: [1, 1.05, 1] }} 
               transition={{ repeat: Infinity, duration: 2, delay: 1 }}
               className="absolute bottom-3 left-1/2 -translate-x-1/2 px-2 py-1 bg-green-600 text-white rounded text-[8px] font-bold shadow-lg"
             >
               Part No: 85/402
             </motion.div>
          </div>
          <p className="mt-2 text-[9px] text-slate-500 flex items-start">
            <Info className="w-3 h-3 mr-1 mt-0.5 text-green-500" />
            Part Number is the first half of the fraction (e.g., 85).
          </p>
        </div>
      </div>
    </div>
  );
}
