export class SlotNotAvailableError extends Error {
  constructor() {
    super('Slot is not available');
    this.name = 'SlotNotAvailableError';
  }
}
