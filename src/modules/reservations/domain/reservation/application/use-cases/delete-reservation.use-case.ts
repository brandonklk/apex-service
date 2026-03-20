import { Injectable } from '@nestjs/common';

import { ReservationRepository } from '../repositories/reservation.repository';
import { Either, left, right } from '@/core/either/either';
import { DeleteReservationInput } from './input/delete.input';
import { ReservationNotFoundError } from './errors/reservation-not-found.error';
import { ReservationError } from './errors/reservation.error';
import { CancellationNotAllowedError } from './errors/cancellation-not-allowed.error';
import { InvalidReservationStatusTransitionError } from './errors/invalid-reservation-status-transition.error';

type Response = Either<
  | ReservationNotFoundError
  | InvalidReservationStatusTransitionError
  | CancellationNotAllowedError
  | ReservationError,
  null
>;

@Injectable()
export class DeleteReservationUseCase {
  constructor(private reservations: ReservationRepository) {}

  async execute(data: DeleteReservationInput): Promise<Response> {
    const { id: reservationId } = data;

    const reservationData = await this.reservations.findById(reservationId);

    if (!reservationData) {
      return left(new ReservationNotFoundError(reservationId));
    }

    const result = reservationData.cancel(new Date());

    if (result.isLeft()) {
      return left(result.getLeft());
    }

    try {
      await this.reservations.update(reservationData);
    } catch (error) {
      return left(new ReservationError());
    }

    return right(null);
  }
}
