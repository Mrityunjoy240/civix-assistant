import { StateElectionData } from '@/types';

export function parseDate(dateString: string | Date): Date {
  if (dateString instanceof Date) return dateString;
  return new Date(dateString);
}

export function getDaysUntil(dateString: string | Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = parseDate(dateString);
  target.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getDaysSince(dateString: string | Date): number {
  return -getDaysUntil(dateString);
}

export function formatDeadline(dateString: string | Date): string {
  const days = getDaysUntil(dateString);
  if (days < 0) {
    return `Passed on ${formatDateShort(dateString)}`;
  } else if (days === 0) {
    return 'Today';
  } else if (days === 1) {
    return 'Tomorrow';
  } else {
    return `${days} days away`;
  }
}

export function formatDateShort(dateString: string | Date): string {
  const date = parseDate(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export interface DeadlineInfo {
  type: string;
  date: string;
  daysUntil: number;
  display: string;
  urgency: 'critical' | 'soon' | 'comfortable' | 'passed';
}

export function getDeadlinesForState(stateData: StateElectionData): DeadlineInfo[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadlines: DeadlineInfo[] = [
    {
      type: 'Registration Deadline',
      date: stateData.registrationDeadline,
      daysUntil: getDaysUntil(stateData.registrationDeadline),
      display: '',
      urgency: 'comfortable'
    },
    {
      type: 'Mail Ballot Request',
      date: stateData.mailBallotRequestDeadline,
      daysUntil: getDaysUntil(stateData.mailBallotRequestDeadline),
      display: '',
      urgency: 'comfortable'
    },
    {
      type: 'Early Voting Starts',
      date: stateData.earlyVotingStart,
      daysUntil: getDaysUntil(stateData.earlyVotingStart),
      display: '',
      urgency: 'comfortable'
    },
    {
      type: 'Early Voting Ends',
      date: stateData.earlyVotingEnd,
      daysUntil: getDaysUntil(stateData.earlyVotingEnd),
      display: '',
      urgency: 'comfortable'
    },
    {
      type: 'Election Day',
      date: stateData.electionDate,
      daysUntil: getDaysUntil(stateData.electionDate),
      display: '',
      urgency: 'comfortable'
    }
  ];

  return deadlines.map(d => {
    d.display = formatDeadline(d.date);
    if (d.daysUntil < 0) {
      d.urgency = 'passed';
    } else if (d.daysUntil <= 7) {
      d.urgency = 'critical';
    } else if (d.daysUntil <= 30) {
      d.urgency = 'soon';
    } else {
      d.urgency = 'comfortable';
    }
    return d;
  });
}

export function getNextDeadline(stateData: StateElectionData): DeadlineInfo | null {
  const deadlines = getDeadlinesForState(stateData);
  const upcoming = deadlines.filter(d => d.daysUntil >= 0);
  if (upcoming.length === 0) return null;
  return upcoming.reduce((a, b) => a.daysUntil < b.daysUntil ? a : b);
}

export function findStateData(stateName: string, allStates: StateElectionData[]): StateElectionData | null {
  const normalized = stateName.toLowerCase().trim();
  return allStates.find(s => s.state.toLowerCase() === normalized) || null;
}