'use client';

import { motion } from 'framer-motion';

interface SuggestionChip {
  label: string;
  icon: string;
  prompt: string;
}

interface SuggestionChipsProps {
  flows: SuggestionChip[];
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}

export default function SuggestionChips({ flows, onSelect, disabled }: SuggestionChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {flows.map((flow, index) => (
        <motion.button
          key={index}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(flow.prompt)}
          disabled={disabled}
          className="flex items-center space-x-2 bg-white border border-slate-200 rounded-full px-4 py-2 text-sm text-slate-700 hover:border-primary-300 hover:bg-primary-50 transition-colors shadow-sm disabled:opacity-50"
        >
          <span>{flow.icon}</span>
          <span>{flow.label}</span>
        </motion.button>
      ))}
    </div>
  );
}
