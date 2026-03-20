import { CheckInReservationResponse } from '../dtos/checkin-reservation.response';

export class CheckInReservationPresenter {
  static toHTTP(data: { reservationId: string }): CheckInReservationResponse {
    return { id: data.reservationId };
  }
}
