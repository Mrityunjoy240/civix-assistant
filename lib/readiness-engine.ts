import { DeadlineInfo } from '@/lib/deadline-engine';

export interface ReadinessInput {
  locationDetected: boolean;
  registrationCompleted: boolean;
  voterIdVerified: boolean;
  hasUpcomingDeadline: boolean;
  pollingBoothChecked: boolean;
}

export interface ReadinessItem {
  label: string;
  completed: boolean;
  detail: string;
}

export interface ReadinessResult {
  score: number;
  completedCount: number;
  totalCount: number;
  checklist: ReadinessItem[];
  riskLevel: 'low' | 'medium' | 'high';
  nextRecommendedAction: string;
}

export function calculateReadiness(input: ReadinessInput): ReadinessResult {
  const checklist: ReadinessItem[] = [
    { label: 'Location selected', completed: input.locationDetected, detail: input.locationDetected ? 'Jurisdiction detected.' : 'Select your voting location.' },
    { label: 'Voter registration', completed: input.registrationCompleted, detail: input.registrationCompleted ? 'Registration marked complete.' : 'Complete registration status check.' },
    { label: 'Voter ID verification', completed: input.voterIdVerified, detail: input.voterIdVerified ? 'Identity document verified.' : 'Verification pending.' },
    { label: 'Deadline tracked', completed: input.hasUpcomingDeadline, detail: input.hasUpcomingDeadline ? 'Next verified deadline available.' : 'No verified deadline data yet.' },
    { label: 'Polling booth checked', completed: input.pollingBoothChecked, detail: input.pollingBoothChecked ? 'Polling booth confirmed.' : 'Find and confirm polling booth.' }
  ];

  const completedCount = checklist.filter((item) => item.completed).length;
  const totalCount = checklist.length;
  const score = Math.round((completedCount / totalCount) * 100);

  const riskLevel: ReadinessResult['riskLevel'] = score >= 80 ? 'low' : score >= 50 ? 'medium' : 'high';

  const nextRecommendedAction = checklist.find((item) => !item.completed)?.label ?? 'You are election-ready.';

  return { score, completedCount, totalCount, checklist, riskLevel, nextRecommendedAction };
}

export function formatNextDeadlineText(deadline: DeadlineInfo | null): string {
  if (!deadline) return 'No verified upcoming deadline';
  return `${deadline.type}: ${deadline.display}`;
}
