export class ReservationConfirmedEvent {
  constructor(
    public readonly reservationId: string,
    public readonly slotId: string,
    public readonly date: Date,
  ) {}
}
