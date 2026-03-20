import { ReservationNotCreatedError } from './reservation-not-created.error';

describe('ReservationNotCreatedError', () => {
  it('should create an error with correct message and name', () => {
    const error = new ReservationNotCreatedError();

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('ReservationNotCreatedError');
    expect(error.message).toBe('Reservation could not be created');
  });
});