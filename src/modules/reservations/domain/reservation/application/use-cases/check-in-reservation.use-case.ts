import { Injectable } from '@nestjs/common';
import { ReservationRepository } from '../repositories/reservation.repository';
import { Either, left, right } from '@/core/either/either';
import { CheckInReservationInput } from './input/check-in.input';
import { ReservationNotFoundError } from './errors/reservation-not-found.error';
import { InvalidReservationStatusTransitionError } from './errors/invalid-reservation-status-transition.error';
import { ReservationCheckInBeforeError } from './errors/reservation-check-in-before.error';
import { ReservationError } from './errors/reservation.error';

type Response = Either<
  | ReservationNotFoundError
  | InvalidReservationStatusTransitionError
  | ReservationCheckInBeforeError
  | ReservationError,
  { reservationId: string }
>;

@Injectable()
export class CheckInReservationUseCase {
  constructor(private reservations: ReservationRepository) {}

  async execute(data: CheckInReservationInput): Promise<Response> {
    const { id: reservationId } = data;

    const reservation = await this.reservations.findById(reservationId);

    if (!reservation) {
      return left(new ReservationNotFoundError(reservationId));
    }

    const result = reservation.checkIn();

    if (result.isLeft()) {
      return left(result.getLeft());
    }

    try {
      await this.reservations.update(reservation);
    } catch (error) {
      // TODO: Log error
      return left(new ReservationError());
    }

    return right({ reservationId: reservation.id });
  }
}
