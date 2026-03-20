import { Reservation } from '@/modules/reservations/domain/reservation/enterprise/entities/reservation.entities';
import { GetReservationResponse } from '../dtos/get-reservation.response';

export class GetReservationPresenter {
  static toHTTP(data: Reservation): GetReservationResponse {
    return {
      id: data.id,
      slotId: data.slotId,
      passengerId: data.passengerId,
      date: data.date,
      status: data.status,
    };
  }
}
