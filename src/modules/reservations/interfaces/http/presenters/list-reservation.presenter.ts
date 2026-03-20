import { PaginatedResult } from '@/modules/reservations/domain/reservation/application/repositories/types/paginated-result';
import { Reservation } from '@/modules/reservations/domain/reservation/enterprise/entities/reservation.entities';
import { ListReservationResponse } from '../dtos/list-reservation.response';

export class ListReservationPresenter {
  static toHTTP(data: PaginatedResult<Reservation>): ListReservationResponse {
    return {
      data: data.data.map((reservation) => ({
        id: reservation.id,
        slotId: reservation.slotId,
        passengerId: reservation.passengerId,
        date: reservation.date,
        status: reservation.status,
      })),
      pagination: {
        total: data.total,
        page: data.page,
        size: data.size,
      },
    };
  }
}
