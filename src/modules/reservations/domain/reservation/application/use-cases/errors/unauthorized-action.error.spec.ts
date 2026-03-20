import { UnauthorizedActionError } from './unauthorized-action.error';

describe('UnauthorizedActionError', () => {
  it('should create an error with correct message and name', () => {
    const error = new UnauthorizedActionError();

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('UnauthorizedActionError');
    expect(error.message).toBe('User is not allowed to perform this action');
  });
});