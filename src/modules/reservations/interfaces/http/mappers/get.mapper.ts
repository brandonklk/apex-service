import { GetReservationInput } from '@/modules/reservations/domain/reservation/application/use-cases/input/get.input';

export class GetReservationMapper {
  static toInput(id: string): GetReservationInput {
    return {
      id,
    };
  }
}
