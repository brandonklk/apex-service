import { InvalidBodyError } from './invalid-body.error';
import { BadRequestException } from '@nestjs/common';

describe('InvalidBodyError', () => {
  it('should extend BadRequestException with message and errors', () => {
    const errors = { id: ['Required'] };
    const exception = new InvalidBodyError(errors);

    expect(exception).toBeInstanceOf(BadRequestException);
    expect(exception.getResponse()).toEqual({
      message: 'Invalid request body',
      errors,
    });
  });
});
