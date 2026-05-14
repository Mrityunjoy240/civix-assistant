import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SuggestionChips from './SuggestionChips';

describe('SuggestionChips', () => {
  const mockFlows = [
    { label: 'How to vote?', icon: '🗳️', prompt: 'How to vote?' },
    { label: 'Check my registration', icon: '📝', prompt: 'Check my registration' }
  ];

  it('renders wrapper div even with an empty array', () => {
    const { container } = render(<SuggestionChips flows={[]} onSelect={vi.fn()} />);
    expect(container.firstChild).not.toBeNull();
    expect(container.querySelector('div')).toHaveClass('flex-wrap');
  });

  it('renders suggestions and handles clicks', () => {
    const mockOnSelect = vi.fn();
    
    render(<SuggestionChips flows={mockFlows} onSelect={mockOnSelect} />);
    
    const chip1 = screen.getByText('How to vote?');
    const chip2 = screen.getByText('Check my registration');
    
    expect(chip1).toBeInTheDocument();
    expect(chip2).toBeInTheDocument();
    
    fireEvent.click(chip1);
    expect(mockOnSelect).toHaveBeenCalledWith('How to vote?');
    expect(mockOnSelect).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    const mockOnSelect = vi.fn();
    render(<SuggestionChips flows={mockFlows} onSelect={mockOnSelect} disabled={true} />);
    
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });
});
