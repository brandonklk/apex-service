import { ReservationImmutableError } from './reservation-immutable.error';

describe('ReservationImmutableError', () => {
  it('should create an error with correct message and name', () => {
    const error = new ReservationImmutableError();

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('ReservationImmutableError');
    expect(error.message).toBe('Reservation cannot be modified');
  });
});