export class ReservationCheckInBeforeError extends Error {
  constructor() {
    super('Check-in before the scheduled time is not permitted.');
    this.name = 'ReservationCheckInBeforeError';
  }
}
