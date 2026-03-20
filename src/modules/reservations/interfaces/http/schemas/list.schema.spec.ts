import { ReservationStatus } from '@/modules/reservations/domain/reservation/enterprise/enums/reservation-status';
import { listReservationSchema } from './list.schema';

describe('listReservationSchema', () => {
  const validUuid = '550e8400-e29b-41d4-a716-446655440000';

  it('should parse valid input with all fields', () => {
    const input = {
      status: ReservationStatus.CONFIRMED,
      page: 2,
      size: 20,
      date: '2026-03-20',
      slotId: validUuid,
    };

    const result = listReservationSchema.parse(input);

    expect(result.page).toBe(2);
    expect(result.size).toBe(20);
    expect(result.slotId).toBe(validUuid);
    expect(result.status).toBe(input.status);

    expect(result.date).toBeInstanceOf(Date);
    expect(result.date?.getFullYear()).toBe(2026);
  });

  it('should apply default values for page and size', () => {
    const result = listReservationSchema.parse({});

    expect(result.page).toBe(1);
    expect(result.size).toBe(10);
  });

  it('should convert string numbers to number', () => {
    const result = listReservationSchema.parse({
      page: '3',
      size: '15',
    });

    expect(result.page).toBe(3);
    expect(result.size).toBe(15);
  });

  it('should reject invalid number', () => {
    expect(() => listReservationSchema.parse({ page: 'abc' })).toThrow();
  });

  it('should reject negative numbers', () => {
    expect(() => listReservationSchema.parse({ page: -1 })).toThrow();
  });

  it('should reject zero', () => {
    expect(() => listReservationSchema.parse({ page: 0 })).toThrow();
  });

  it('should reject size greater than max (500)', () => {
    expect(() => listReservationSchema.parse({ size: 501 })).toThrow();
  });

  it('should accept valid date string and transform to Date', () => {
    const result = listReservationSchema.parse({
      date: '2026-03-20',
    });

    expect(result.date).toBeInstanceOf(Date);
    expect(result.date?.getHours()).toBe(0);
  });

  it('should return undefined if date is not provided', () => {
    const result = listReservationSchema.parse({});

    expect(result.date).toBeUndefined();
  });

  it('should reject invalid date format', () => {
    expect(() =>
      listReservationSchema.parse({ date: 'invalid-date' }),
    ).toThrow();
  });

  it('should validate slotId when provided', () => {
    const result = listReservationSchema.parse({
      slotId: validUuid,
    });

    expect(result.slotId).toBe(validUuid);
  });

  it('should reject invalid slotId', () => {
    expect(() => listReservationSchema.parse({ slotId: 'invalid' })).toThrow();
  });

  it('should accept undefined optional fields', () => {
    const result = listReservationSchema.parse({
      status: undefined,
      slotId: undefined,
      date: undefined,
    });

    expect(result.status).toBeUndefined();
    expect(result.slotId).toBeUndefined();
    expect(result.date).toBeUndefined();
  });
});
