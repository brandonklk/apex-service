import { CancellationNotAllowedError } from './cancellation-not-allowed.error';

describe('CancellationNotAllowedError', () => {
  it('should create an error with correct message and name', () => {
    const error = new CancellationNotAllowedError();

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('CancellationNotAllowedError');
    expect(error.message).toBe('Cancellation must be at least 4 hours in advance');
  });
});