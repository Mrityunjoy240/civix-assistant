import { describe, it, expect } from 'vitest';
import { calculateReadiness } from './readiness-engine';

describe('readiness-engine', () => {
  it('returns expected score and checklist', () => {
    const result = calculateReadiness({
      locationDetected: true,
      registrationCompleted: true,
      voterIdVerified: false,
      hasUpcomingDeadline: true,
      pollingBoothChecked: false
    });

    expect(result.score).toBe(60);
    expect(result.completedCount).toBe(3);
    expect(result.totalCount).toBe(5);
    expect(result.riskLevel).toBe('medium');
    expect(result.checklist.length).toBe(5);
  });
});
