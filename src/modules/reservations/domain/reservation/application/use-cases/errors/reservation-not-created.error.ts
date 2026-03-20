export class ReservationNotCreatedError extends Error {
  constructor() {
    super('Reservation could not be created');
    this.name = 'ReservationNotCreatedError';
  }
}
