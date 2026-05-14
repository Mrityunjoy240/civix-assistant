'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, CheckCircle2, XCircle, Award, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/utils';
import confetti from 'canvas-confetti';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "What is the minimum age to vote in India/US/Canada?",
    options: ["16 years", "18 years", "21 years"],
    correct: 1,
    fact: "The voting age was lowered from 21 to 18 in India by the 61st Amendment Act in 1988."
  },
  {
    id: 2,
    question: "Can you vote if you don't have your physical Voter ID card on election day?",
    options: ["Yes, with other ID", "No", "Only in special cases"],
    correct: 0,
    fact: "You can vote using alternative photo IDs like Aadhaar, Passport, or DL if your name is in the voter list."
  },
  {
    id: 3,
    question: "Which official body conducts elections in India?",
    options: ["Supreme Court", "Parliament", "Election Commission"],
    correct: 2,
    fact: "The Election Commission of India (ECI) is an autonomous constitutional authority."
  }
];

export default function CivicQuiz() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const handleAnswer = (idx: number) => {
    if (hasAnswered) return;
    setSelectedOption(idx);
    setHasAnswered(true);
    if (idx === QUIZ_QUESTIONS[currentStep].correct) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
      setSelectedOption(null);
      setHasAnswered(false);
    } else {
      setShowResult(true);
      if (score >= 2) {
        confetti({ particleCount: 100, spread: 50, origin: { y: 0.8 } });
      }
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setHasAnswered(false);
  };

  return (
    <div className="bg-white rounded-lg ring-1 ring-zinc-200 shadow-sm overflow-hidden transition-all">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-white hover:bg-zinc-50 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-zinc-700" />
          <h3 className="font-semibold text-zinc-900 text-sm">Civic IQ Quiz</h3>
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
            <div className="p-4 border-t border-zinc-100">
              <AnimatePresence mode="wait">
                {!showResult ? (
                  <motion.div
                    key="question"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-4"
                  >
                    <p className="text-xs font-semibold text-zinc-800 leading-relaxed min-h-[40px]">
                      {QUIZ_QUESTIONS[currentStep].question}
                    </p>
                    
                    <div className="space-y-2">
                      {QUIZ_QUESTIONS[currentStep].options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleAnswer(i)}
                          disabled={hasAnswered}
                          className={cn(
                            "w-full text-left px-3 py-2.5 rounded-md text-[10px] font-semibold transition-all border",
                            selectedOption === i 
                              ? (i === QUIZ_QUESTIONS[currentStep].correct ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700")
                              : (hasAnswered && i === QUIZ_QUESTIONS[currentStep].correct ? "bg-green-50 border-green-200 text-green-700" : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50")
                          )}
                        >
                          <div className="flex items-center justify-between">
                            {opt}
                            {hasAnswered && i === QUIZ_QUESTIONS[currentStep].correct && <CheckCircle2 className="w-4 h-4" />}
                            {hasAnswered && selectedOption === i && i !== QUIZ_QUESTIONS[currentStep].correct && <XCircle className="w-4 h-4" />}
                          </div>
                        </button>
                      ))}
                    </div>

                    {hasAnswered && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
                        <div className="p-3 bg-zinc-50 rounded-md ring-1 ring-inset ring-zinc-200 mb-4">
                          <p className="text-[10px] text-zinc-600 leading-tight">
                            <strong className="text-zinc-900">Fact:</strong> {QUIZ_QUESTIONS[currentStep].fact}
                          </p>
                        </div>
                        <button 
                          onClick={nextQuestion}
                          className="w-full bg-zinc-900 text-white text-[10px] font-semibold py-2.5 rounded-md hover:bg-zinc-800 transition-colors shadow-sm"
                        >
                          {currentStep === QUIZ_QUESTIONS.length - 1 ? 'See Results' : 'Next Question'}
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-4"
                  >
                    <Award className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                    <h4 className="text-lg font-bold text-zinc-900 mb-1">Score: {score}/{QUIZ_QUESTIONS.length}</h4>
                    <p className="text-[10px] text-zinc-500 mb-5 font-medium">
                      {score === QUIZ_QUESTIONS.length ? 'Legendary Civic Expert!' : 'Good effort! Keep learning.'}
                    </p>
                    <button 
                      onClick={resetQuiz}
                      className="w-full bg-zinc-900 text-white text-[10px] font-semibold py-2.5 rounded-md hover:bg-zinc-800 transition-colors shadow-sm"
                    >
                      Try Again
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
