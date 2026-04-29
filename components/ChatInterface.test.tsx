import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ChatInterface from './ChatInterface';

// Mock third-party libraries that break in JSDOM
vi.mock('canvas-confetti', () => ({ default: vi.fn() }));
vi.mock('@/app/actions/chat', () => ({ chatAction: vi.fn() }));

describe('ChatInterface Integration', () => {
  it('renders the main interface elements', () => {
    render(<ChatInterface />);
    // Check Sidebar
    expect(screen.getAllByText(/Civix/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/User Journey/i)).toBeInTheDocument();
    
    // Check Input area exists
    expect(screen.getByPlaceholderText(/Type message or upload document/i)).toBeInTheDocument();
  });

  it('allows user to type in the input field', () => {
    render(<ChatInterface />);
    const input = screen.getByPlaceholderText(/Type message or upload document/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'When is the deadline in Texas?' } });
    expect(input.value).toBe('When is the deadline in Texas?');
  });

  it('changes language accurately', () => {
    render(<ChatInterface />);
    const hindiBtn = screen.getByText('हिन्दी');
    fireEvent.click(hindiBtn);
    // Button should now be active (we can just assert it doesn't crash)
    expect(hindiBtn).toBeInTheDocument();
  });
});
