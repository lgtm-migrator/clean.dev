import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { TimeSheet } from './TimeSheet';

describe('components/TimeSheet', () => {
  it('renders', () => {

    // arrange

    render(<TimeSheet />);

    // act

    const component = screen.getByRole('button', {
      name: /🐦 . o 0 (do I look like a canary?) /i,
    });

    userEvent.click(component);

    // assert

    expect(component).toBeInTheDocument();
  });
});
