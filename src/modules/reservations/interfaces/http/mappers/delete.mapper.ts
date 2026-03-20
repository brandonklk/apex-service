import { DeleteReservationInput } from '@/modules/reservations/domain/reservation/application/use-cases/input/delete.input';

export class DeleteReservationMapper {
  static toInput(id: string): DeleteReservationInput {
    return {
      id,
    };
  }
}
