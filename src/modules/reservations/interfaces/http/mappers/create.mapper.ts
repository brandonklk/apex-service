import { CreateReservationInput } from '@/modules/reservations/domain/reservation/application/use-cases/input/create.input';
import { CreateReservationRequest } from '../dtos/create-reservation.request';

export class CreateReservationMapper {
  static toInput(dto: CreateReservationRequest): CreateReservationInput {
    return {
      passengerId: dto.passengerId,
      slotId: dto.slotId,
    };
  }
}
