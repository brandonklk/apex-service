import { CreateReservationResponse } from '../dtos/create-reservation.response';

export class CreateReservationPresenter {
  static toHTTP(data: { reservationId: string }): CreateReservationResponse {
    return {
      id: data.reservationId,
    };
  }
}
