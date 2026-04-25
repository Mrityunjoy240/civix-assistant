'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, CheckCircle2, XCircle, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
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
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm overflow-hidden relative group">
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary-50 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-500" />
      
      <div className="relative z-10">
        <div className="flex items-center space-x-2 mb-6">
          <Brain className="w-5 h-5 text-primary-600" />
          <h3 className="font-bold text-slate-800 text-sm">Civic IQ Quiz</h3>
        </div>

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key="question"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              <p className="text-xs font-bold text-slate-700 leading-relaxed min-h-[40px]">
                {QUIZ_QUESTIONS[currentStep].question}
              </p>
              
              <div className="space-y-2">
                {QUIZ_QUESTIONS[currentStep].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    disabled={hasAnswered}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-xl text-[10px] font-bold transition-all border",
                      selectedOption === i 
                        ? (i === QUIZ_QUESTIONS[currentStep].correct ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700")
                        : (hasAnswered && i === QUIZ_QUESTIONS[currentStep].correct ? "bg-green-50 border-green-200 text-green-700" : "bg-slate-50 border-slate-100 text-slate-500 hover:border-primary-200")
                    )}
                  >
                    <div className="flex items-center justify-between">
                      {opt}
                      {hasAnswered && i === QUIZ_QUESTIONS[currentStep].correct && <CheckCircle2 className="w-3 h-3" />}
                      {hasAnswered && selectedOption === i && i !== QUIZ_QUESTIONS[currentStep].correct && <XCircle className="w-3 h-3" />}
                    </div>
                  </button>
                ))}
              </div>

              {hasAnswered && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
                  <div className="p-3 bg-primary-50 rounded-xl mb-4">
                    <p className="text-[9px] text-primary-700 leading-tight">
                      <strong>Fact:</strong> {QUIZ_QUESTIONS[currentStep].fact}
                    </p>
                  </div>
                  <button 
                    onClick={nextQuestion}
                    className="w-full bg-slate-900 text-white text-[10px] font-bold py-2.5 rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    {currentStep === QUIZ_QUESTIONS.length - 1 ? 'SEE RESULTS' : 'NEXT QUESTION'}
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
              <Award className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h4 className="text-lg font-black text-slate-800 mb-1">Score: {score}/{QUIZ_QUESTIONS.length}</h4>
              <p className="text-[10px] text-slate-500 mb-6 font-medium">
                {score === QUIZ_QUESTIONS.length ? 'Legendary Civic Expert!' : 'Good effort! Keep learning.'}
              </p>
              <button 
                onClick={resetQuiz}
                className="w-full bg-primary-600 text-white text-[10px] font-bold py-2.5 rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200"
              >
                TRY AGAIN
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
