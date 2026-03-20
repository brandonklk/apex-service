export class ReservationError extends Error {
  constructor() {
    super(`Reservation error`);
    this.name = 'ReservationError';
  }
}
