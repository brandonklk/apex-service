import { BadRequestException } from '@nestjs/common';

export class InvalidBodyError extends BadRequestException {
  constructor(errors: unknown) {
    super({
      message: 'Invalid request body',
      errors,
    });
  }
}
