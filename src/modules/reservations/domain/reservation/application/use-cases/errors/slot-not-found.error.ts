export class SlotNotFoundError extends Error {
  constructor(public readonly slotId: string) {
    super(`Slot ${slotId} not found`);
    this.name = 'SlotNotFoundError';
  }
}
