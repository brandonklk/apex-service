import { ReservationError } from './reservation.error';

describe('ReservationError', () => {
  it('should create an error with correct message and name', () => {
    const error = new ReservationError();

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('ReservationError');
    expect(error.message).toBe('Reservation error');
  });
});
