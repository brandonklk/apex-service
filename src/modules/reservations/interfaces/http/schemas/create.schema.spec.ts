import { createReservationSchema } from './create.schema';

describe('createReservationSchema', () => {
  const validUuid = '550e8400-e29b-41d4-a716-446655440000';

  it('should validate valid input', () => {
    const input = {
      passengerId: validUuid,
      slotId: validUuid,
    };

    const result = createReservationSchema.parse(input);

    expect(result).toEqual(input);
  });

  it('should fail if passengerId is invalid', () => {
    const input = {
      passengerId: 'invalid',
      slotId: validUuid,
    };

    expect(() => createReservationSchema.parse(input)).toThrow();
  });

  it('should fail if slotId is invalid', () => {
    const input = {
      passengerId: validUuid,
      slotId: 'invalid',
    };

    expect(() => createReservationSchema.parse(input)).toThrow();
  });

  it('should fail if fields are missing', () => {
    expect(() => createReservationSchema.parse({})).toThrow();
  });
});
