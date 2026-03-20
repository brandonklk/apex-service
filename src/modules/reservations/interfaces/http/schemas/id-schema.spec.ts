import { checkInReservationSchema } from './check-in.schema';
import { confirmReservationSchema } from './confirm.shema';
import { deleteReservationSchema } from './delete.shema';
import { getReservationSchema } from './get.schema';

describe('UUID Schemas', () => {
  const validUuid = '550e8400-e29b-41d4-a716-446655440000';
  const invalidUuid = 'invalid-uuid';

  const schemas = [
    checkInReservationSchema,
    confirmReservationSchema,
    deleteReservationSchema,
    getReservationSchema,
  ];

  it('should accept valid uuid v4', () => {
    schemas.forEach((schema) => {
      expect(schema.parse(validUuid)).toBe(validUuid);
    });
  });

  it('should reject invalid uuid', () => {
    schemas.forEach((schema) => {
      expect(() => schema.parse(invalidUuid)).toThrow();
    });
  });

  it('should reject empty value', () => {
    schemas.forEach((schema) => {
      expect(() => schema.parse('')).toThrow();
    });
  });
});
