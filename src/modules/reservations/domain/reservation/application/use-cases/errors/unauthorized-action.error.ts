export class UnauthorizedActionError extends Error {
  constructor() {
    super('User is not allowed to perform this action');
    this.name = 'UnauthorizedActionError';
  }
}
