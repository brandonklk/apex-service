import { CheckInReservationInput } from '@/modules/reservations/domain/reservation/application/use-cases/input/check-in.input';

export class CheckInReservationMapper {
  static toInput(id: string): CheckInReservationInput {
    return {
      id,
    };
  }
}
