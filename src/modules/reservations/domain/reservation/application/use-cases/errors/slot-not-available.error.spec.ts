import { SlotNotAvailableError } from './slot-not-available.error';

describe('SlotNotAvailableError', () => {
  it('should create an error with correct message and name', () => {
    const error = new SlotNotAvailableError();

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('SlotNotAvailableError');
    expect(error.message).toBe('Slot is not available');
  });
});
