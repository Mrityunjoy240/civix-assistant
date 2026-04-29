import { describe, it, expect } from 'vitest';
import { parseLocation, isValidLocation, formatLocation } from './location-parser';

describe('location-parser', () => {
  describe('parseLocation', () => {
    it('detects US states correctly', () => {
      expect(parseLocation('I live in Texas')).toEqual({ country: 'us', state: 'Texas', county: undefined });
      expect(parseLocation('What about new york?')).toEqual({ country: 'us', state: 'New York', county: undefined });
    });

    it('detects aliases', () => {
      expect(parseLocation('I am in CA')).toEqual({ country: 'us', state: 'California', county: undefined });
    });

    it('detects international countries', () => {
      expect(parseLocation('Canada')).toEqual({ country: 'canada', state: undefined, county: undefined });
      expect(parseLocation('Elections India')).toEqual({ country: 'india', state: undefined, county: undefined });
    });
  });

  describe('isValidLocation', () => {
    it('validates correctly', () => {
      expect(isValidLocation({ country: 'us', state: 'Texas' })).toBe(true);
      expect(isValidLocation(null)).toBe(false);
    });
  });

  describe('formatLocation', () => {
    it('formats correctly', () => {
      expect(formatLocation({ country: 'us', state: 'Texas' })).toBe('Texas, US');
      expect(formatLocation({ country: 'canada' })).toBe('CANADA');
      expect(formatLocation(null)).toBe('');
    });
  });
});
