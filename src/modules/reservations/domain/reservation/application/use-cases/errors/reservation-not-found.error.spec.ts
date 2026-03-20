import { ReservationNotFoundError } from './reservation-not-found.error';

describe('ReservationNotFoundError', () => {
  it('should create an error with correct message and name', () => {
    const reservationId = '550e8400-e29b-41d4-a716-446655440000';
    const error = new ReservationNotFoundError(reservationId);

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('ReservationNotFoundError');
    expect(error.message).toBe(`Reservation ${reservationId} not found`);
    expect(error.reservationId).toBe(reservationId);
  });
});
