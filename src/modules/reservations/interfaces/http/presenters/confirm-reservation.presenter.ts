import { ConfirmReservationResponse } from '../dtos/confirm-reservation.response';

export class ConfirmReservationPresenter {
  static toHTTP(data: { reservationId: string }): ConfirmReservationResponse {
    return { id: data.reservationId };
  }
}
