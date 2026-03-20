export class CancellationNotAllowedError extends Error {
  constructor() {
    super('Cancellation must be at least 4 hours in advance');
    this.name = 'CancellationNotAllowedError';
  }
}
