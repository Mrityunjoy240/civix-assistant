import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SuggestionChips from './SuggestionChips';

describe('SuggestionChips', () => {
  it('renders correctly with an empty array', () => {
    const { container } = render(<SuggestionChips suggestions={[]} onSelect={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders suggestions and handles clicks', () => {
    const mockOnSelect = vi.fn();
    const suggestions = ['How to vote?', 'Check my registration'];
    
    render(<SuggestionChips suggestions={suggestions} onSelect={mockOnSelect} />);
    
    const chip1 = screen.getByText('How to vote?');
    const chip2 = screen.getByText('Check my registration');
    
    expect(chip1).toBeInTheDocument();
    expect(chip2).toBeInTheDocument();
    
    fireEvent.click(chip1);
    expect(mockOnSelect).toHaveBeenCalledWith('How to vote?');
    expect(mockOnSelect).toHaveBeenCalledTimes(1);
  });
});
