import { Inject, Injectable } from '@nestjs/common';

import { randomUUID } from 'crypto';

import { ReservationRepository } from '../repositories/reservation.repository';
import { CreateReservationInput } from './input/create.input';
import { SlotNotAvailableError } from './errors/slot-not-available.error';
import { Either, left, right } from '@/core/either/either';
import { Reservation } from '../../enterprise/entities/reservation.entities';
import { ReservationNotCreatedError } from './errors/reservation-not-created.error';
import { Logger, LOGGER } from '../logger/logger';

type Response = Either<
  SlotNotAvailableError | ReservationNotCreatedError,
  { reservationId: string }
>;

@Injectable()
export class CreateReservationUseCase {
  constructor(
    private reservations: ReservationRepository,
    @Inject(LOGGER) private logger: Logger,
  ) {}

  async execute(data: CreateReservationInput): Promise<Response> {
    const { passengerId, slotId } = data;

    if (!passengerId || !slotId) {
      return left(new ReservationNotCreatedError());
    }

    const date = new Date();

    const existingReservation =
      await this.reservations.findReservedBySlotAndDateAndPassenger(
        slotId,
        date,
        passengerId,
      );

    if (existingReservation) {
      return left(new SlotNotAvailableError());
    }

    const reservation = Reservation.create({
      id: randomUUID(),
      slotId,
      passengerId,
      date,
    });

    try {
      await this.reservations.create(reservation);
    } catch (error) {
      this.logger.error(
        `Failed to create reservation data=${JSON.stringify(reservation)}`,
        String(error),
      );
      return left(new ReservationNotCreatedError());
    }

    return right({
      reservationId: reservation.id,
    });
  }
}
