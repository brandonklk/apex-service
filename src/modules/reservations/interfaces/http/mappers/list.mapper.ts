import { ListReservationRequest } from '../dtos/list-reservation.request';
import { ListReservationInput } from '@/modules/reservations/domain/reservation/application/use-cases/input/list.input';

export class ListReservationMapper {
  static toInput(dto: ListReservationRequest): ListReservationInput {
    return {
      status: dto.status,
      date: dto.date,
      slotId: dto.slotId,
      page: dto.page,
      size: dto.size,
    };
  }
}
