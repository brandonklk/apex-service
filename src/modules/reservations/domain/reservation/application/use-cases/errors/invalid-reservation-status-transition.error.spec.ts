import { InvalidReservationStatusTransitionError } from './invalid-reservation-status-transition.error';
import { ReservationStatus } from '../../../enterprise/enums/reservation-status';

describe('InvalidReservationStatusTransitionError', () => {
  it('should create an error with correct message and name', () => {
    const current = ReservationStatus.PENDING;
    const next = ReservationStatus.CONFIRMED;
    const error = new InvalidReservationStatusTransitionError(current, next);

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('InvalidReservationStatusTransitionError');
    expect(error.message).toBe(`Cannot change status from ${current} to ${next}`);
    expect(error.current).toBe(current);
    expect(error.next).toBe(next);
  });
});