import { ReservationStatus } from '../../../enterprise/enums/reservation-status';

export class InvalidReservationStatusTransitionError extends Error {
  constructor(
    public readonly current: ReservationStatus,
    public readonly next: ReservationStatus,
  ) {
    super(`Cannot change status from ${current} to ${next}`);
    this.name = 'InvalidReservationStatusTransitionError';
  }
}
