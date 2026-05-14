import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('utils', () => {
  describe('cn', () => {
    it('merges tailwind classes correctly', () => {
      expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
    });

    it('handles conditional classes', () => {
      const isActive = true;
      expect(cn('bg-blue-500', isActive && 'text-white', !isActive && 'hidden')).toBe('bg-blue-500 text-white');
    });

    it('resolves tailwind conflicts', () => {
      expect(cn('px-2 py-1', 'p-4')).toBe('p-4');
      expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
    });
  });
});
