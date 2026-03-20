import { SlotNotFoundError } from './slot-not-found.error';

describe('SlotNotFoundError', () => {
  it('should create an error with correct message and name', () => {
    const slotId = 'slot-123';
    const error = new SlotNotFoundError(slotId);

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('SlotNotFoundError');
    expect(error.message).toBe(`Slot ${slotId} not found`);
    expect(error.slotId).toBe(slotId);
  });
});