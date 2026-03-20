import { Injectable } from '@nestjs/common';
import { ReservationRepository } from '../repositories/reservation.repository';
import { SlotNotAvailableError } from './errors/slot-not-available.error';
import { Either, left, right } from '@/core/either/either';
import { ConfirmReservationInput } from './input/confirm.input';
import { ReservationNotFoundError } from './errors/reservation-not-found.error';
import { InvalidReservationStatusTransitionError } from './errors/invalid-reservation-status-transition.error';
import { ReservationConfirmedEvent } from '../events/reservation-confirmed.event';
import { ReservationConfirmedHandler } from '../events/handlers/reservation-confirmed.handler';

type Response = Either<
  | SlotNotAvailableError
  | ReservationNotFoundError
  | InvalidReservationStatusTransitionError,
  { reservationId: string }
>;

@Injectable()
export class ConfirmReservationUseCase {
  constructor(private reservations: ReservationRepository) {}

  async execute(data: ConfirmReservationInput): Promise<Response> {
    const { id: reservationId } = data;

    const reservation = await this.reservations.findById(reservationId);

    if (!reservation) {
      return left(new ReservationNotFoundError(reservationId));
    }

    const existing =
      await this.reservations.findReservedBySlotAndDateAndPassenger(
        reservation.slotId,
        reservation.date,
        reservation.passengerId,
      );

    if (existing && existing.id !== reservation.id) {
      return left(new SlotNotAvailableError());
    }

    const result = reservation.confirm();

    if (result.isLeft()) {
      return left(result.getLeft());
    }

    await this.reservations.update(reservation);

    const event = new ReservationConfirmedEvent(
      reservation.id,
      reservation.slotId,
      reservation.date,
    );

    new ReservationConfirmedHandler().handle(event);

    return right({ reservationId: reservation.id });
  }
}
