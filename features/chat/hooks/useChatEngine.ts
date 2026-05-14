'use client';

import { useState, useTransition, useMemo, useCallback, useEffect } from 'react';
import { Message, Location } from '@/features/chat/schemas';
import { chatAction } from '@/app/actions/chat';
import { US_STATES_ELECTION_DATA } from '@/lib/ai/constants';
import { findStateData, getNextDeadline, getDeadlinesForState } from '@/lib/engine/deadline-engine';
import { parseLocation } from '@/lib/engine/location-parser';
import confetti from 'canvas-confetti';

export type Language = 'English' | 'Hindi' | 'Bengali';

export function useChatEngine() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [location, setLocation] = useState<Location | null>(null);
  const [language, setLanguage] = useState<Language>('English');
  const [isPending, startTransition] = useTransition();
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  // 🚀 Geolocation on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
            const data = await res.json();
            if (data?.address) {
              setLocation({
                country: data.address.country || 'USA',
                state: data.address.state,
                county: data.address.county
              });
            }
          } catch (e) {
            console.error('Geolocation reverse lookup failed', e);
          }
        },
        (error) => {
          console.warn('Geolocation blocked or failed', error);
        }
      );
    }
  }, []);

  // Use useMemo for aggressive memoization of deterministic engines
  // This prevents expensive searches and formatting on every render
  const stateData = useMemo(() => {
    return location?.state ? findStateData(location.state, US_STATES_ELECTION_DATA) : null;
  }, [location?.state]);

  const deadlines = useMemo(() => {
    return stateData ? getDeadlinesForState(stateData) : [];
  }, [stateData]);

  const nextDeadline = useMemo(() => {
    return stateData ? getNextDeadline(stateData) : null;
  }, [stateData]);

  // 🚀 Memoize UI steps derived from chat history & state
  const steps = useMemo(() => {
    return [
      { id: 'register', label: 'Register', isCompleted: location !== null },
      { 
        id: 'prepare', 
        label: 'Prepare', 
        isCompleted: location !== null && messages.some(m => m.role === 'assistant') 
      },
      { 
        id: 'vote', 
        label: 'Vote', 
        isCompleted: location !== null && messages.some(m => 
          /(vote|voted|cast|booth|poll|turnout)/i.test(m.content)
        ) 
      }
    ];
  }, [location, messages]);

  // Handle Confetti Effect (only when steps change appropriately)
  useEffect(() => {
    const newlyCompleted = steps.filter(s => s.isCompleted && !completedSteps.has(s.id));
    if (newlyCompleted.length > 0) {
      const nextSet = new Set(completedSteps);
      newlyCompleted.forEach(s => nextSet.add(s.id));
      setCompletedSteps(nextSet);
      if (nextSet.size === 3) {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#3b82f6', '#10b981', '#ef4444'] });
      }
    }
  }, [steps, completedSteps]);

  // Memoize handlers to prevent prop drilling re-renders
  const handleExport = useCallback(() => {
    if (messages.length === 0) return;
    const text = messages.map(m => `[${m.role.toUpperCase()}]\n${m.content}\n`).join('\n---\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `civix-plan-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url); // Clean up memory
  }, [messages]);

  const handleSend = useCallback((content: string, imageData?: string, imageType?: string) => {
    const userMessage: Message = { id: Date.now().toString(), role: 'user', content, image: imageData, imageType: imageType };
    setMessages(prev => [...prev, userMessage]);
    
    // Process purely deterministic logic (location parser) synchronously before transition
    const detectedLocation = parseLocation(content);
    if (detectedLocation?.state) setLocation(detectedLocation);

    startTransition(async () => {
      try {
        // Async server action call - runs non-blocking
        const result = await chatAction([...messages, userMessage].map(m => ({ 
          role: m.role, content: m.content, image: m.image, imageType: m.imageType 
        })), detectedLocation || location, language);
        
        if (result.response) {
          setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: result.response! }]);
        } else if (result.error) {
          setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: `Error: ${result.error}` }]);
        }
      } catch (error) {
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: "An error occurred while communicating with the AI. Please try again." }]);
      }
    });
  }, [messages, location, language]);

  return {
    messages,
    location,
    language,
    isPending,
    completedSteps,
    steps,
    stateData,
    deadlines,
    nextDeadline,
    setLanguage,
    handleExport,
    handleSend
  };
}
