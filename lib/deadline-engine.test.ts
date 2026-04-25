import { describe, it, expect, vi } from 'vitest';
import { getNextDeadline, getDeadlinesForState, findStateData } from '@/lib/deadline-engine';
import { StateElectionData } from '@/types';

const mockStateData: StateElectionData = {
  state: 'TestState',
  electionDate: '2026-11-03',
  registrationDeadline: '2026-10-04',
  mailBallotRequestDeadline: '2026-10-24',
  earlyVotingStart: '2026-10-20',
  earlyVotingEnd: '2026-10-31',
  registrationUrl: 'https://test.gov/register',
  pollingPlaceUrl: 'https://test.gov/polling'
};

describe('Deadline Engine', () => {
  it('should find state data by name', () => {
    const data = [mockStateData];
    expect(findStateData('TestState', data)).toEqual(mockStateData);
    expect(findStateData('teststate', data)).toEqual(mockStateData);
    expect(findStateData('Unknown', data)).toBeNull();
  });

  it('should calculate deadlines correctly', () => {
    // Mock today to be before all deadlines
    vi.setSystemTime(new Date('2026-09-01'));
    
    const deadlines = getDeadlinesForState(mockStateData);
    expect(deadlines.length).toBe(5);
    expect(deadlines[0].type).toBe('Registration Deadline');
    expect(deadlines[0].urgency).toBe('comfortable');
  });

  it('should identify critical urgency', () => {
    // Mock today to be 3 days before registration deadline (Oct 4)
    vi.setSystemTime(new Date('2026-10-01'));
    
    const deadlines = getDeadlinesForState(mockStateData);
    const regDeadline = deadlines.find(d => d.type === 'Registration Deadline');
    expect(regDeadline?.urgency).toBe('critical');
  });

  it('should return next upcoming deadline', () => {
    vi.setSystemTime(new Date('2026-10-01'));
    const next = getNextDeadline(mockStateData);
    expect(next?.type).toBe('Registration Deadline');

    vi.setSystemTime(new Date('2026-10-05'));
    const nextAfterReg = getNextDeadline(mockStateData);
    expect(nextAfterReg?.type).toBe('Early Voting Starts');
  });
});
