import { describe, it, expect, vi } from 'vitest';
import { getNextDeadline, getDeadlinesForState, findStateData, parseDate, getDaysUntil, getDaysSince, formatDeadline, formatDateShort } from '@/lib/engine/deadline-engine';
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
  it('parseDate should handle string and Date', () => {
    expect(parseDate('2026-10-01')).toBeInstanceOf(Date);
    const d = new Date('2026-10-01');
    expect(parseDate(d)).toBe(d);
  });

  it('getDaysUntil and getDaysSince should calculate diffs', () => {
    vi.setSystemTime(new Date('2026-10-01T12:00:00Z'));
    expect(getDaysUntil('2026-10-05')).toBe(4);
    expect(getDaysSince('2026-09-27')).toBe(4);
  });

  it('formatDeadline should format based on distance', () => {
    vi.setSystemTime(new Date('2026-10-01T12:00:00Z'));
    expect(formatDeadline('2026-10-05')).toBe('4 days away');
    expect(formatDeadline('2026-10-02')).toBe('Tomorrow');
    expect(formatDeadline('2026-10-01')).toBe('Today');
    expect(formatDeadline('2026-09-20')).toContain('Passed on Sep 20');
  });

  it('formatDateShort should format correctly', () => {
    expect(formatDateShort('2026-11-03')).toBe('Nov 3');
  });

  it('should find state data by name', () => {
    const data = [mockStateData];
    expect(findStateData('TestState', data)).toEqual(mockStateData);
    expect(findStateData('teststate', data)).toEqual(mockStateData);
    expect(findStateData('Unknown', data)).toBeNull();
  });

  it('should calculate deadlines correctly', () => {
    vi.setSystemTime(new Date('2026-09-01'));
    const deadlines = getDeadlinesForState(mockStateData);
    expect(deadlines.length).toBe(5);
    expect(deadlines[0].type).toBe('Registration Deadline');
    expect(deadlines[0].urgency).toBe('comfortable');
  });

  it('should identify critical urgency', () => {
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
    
    vi.setSystemTime(new Date('2026-11-04'));
    const noNext = getNextDeadline(mockStateData);
    expect(noNext).toBeNull();
  });
});
