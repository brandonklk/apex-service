import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from './zod-validation.pipe';

describe('ZodValidationPipe', () => {
  const schema = z.object({ id: z.string().uuid() });
  let pipe: ZodValidationPipe;

  beforeEach(() => {
    pipe = new ZodValidationPipe(schema);
  });

  it('should return parsed value when valid', () => {
    const value = { id: '550e8400-e29b-41d4-a716-446655440000' };
    expect(pipe.transform(value)).toEqual(value);
  });

  it('should throw BadRequestException when invalid', () => {
    const value = { id: 'invalid-uuid' };
    expect(() => pipe.transform(value)).toThrow(BadRequestException);
  });
});
