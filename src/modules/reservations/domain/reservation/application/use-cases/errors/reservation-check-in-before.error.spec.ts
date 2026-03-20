import { ReservationCheckInBeforeError } from './reservation-check-in-before.error';

describe('ReservationCheckInBeforeError', () => {
  it('should create an error with correct message and name', () => {
    const error = new ReservationCheckInBeforeError();

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('ReservationCheckInBeforeError');
    expect(error.message).toBe('Check-in before the scheduled time is not permitted.');
  });
});