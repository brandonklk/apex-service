import { ConfirmReservationInput } from '@/modules/reservations/domain/reservation/application/use-cases/input/confirm.input';

export class ConfirmReservationMapper {
  static toInput(id: string): ConfirmReservationInput {
    return {
      id,
    };
  }
}
