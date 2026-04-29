import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import DeadlineWidget from './DeadlineWidget';

describe('DeadlineWidget', () => {
  it('renders null when no deadlines are provided', () => {
    const { container } = render(<DeadlineWidget deadlines={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the deadline widget with correct data', () => {
    const deadlines = [
      { id: '1', name: 'Voter Registration', date: '2026-10-04', type: 'registration' }
    ];
    render(<DeadlineWidget locationName="Texas" deadlines={deadlines} />);
    expect(screen.getByText(/Deadlines/i)).toBeInTheDocument();
  });

  it('handles WhatsApp share button', () => {
    const deadlines = [{ id: '1', name: 'Test Deadline', date: '2026-11-05' }];
    render(<DeadlineWidget locationName="Florida" deadlines={deadlines} />);
    const shareButton = screen.getByTitle('Share to WhatsApp');
    expect(shareButton).toBeInTheDocument();
  });
});
