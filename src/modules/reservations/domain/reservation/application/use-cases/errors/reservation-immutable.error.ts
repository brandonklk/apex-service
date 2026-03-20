export class ReservationImmutableError extends Error {
  constructor() {
    super('Reservation cannot be modified');
    this.name = 'ReservationImmutableError';
  }
}
