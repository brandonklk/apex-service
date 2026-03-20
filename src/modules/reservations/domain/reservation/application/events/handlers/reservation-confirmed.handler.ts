import { ReservationConfirmedEvent } from '../reservation-confirmed.event';

export class ReservationConfirmedHandler {
  handle(event: ReservationConfirmedEvent) {
    console.log('📢 Reservation confirmed:', event);
  }
}
