import { Injectable } from '@nestjs/common';

import { randomUUID } from 'crypto';

import { ReservationRepository } from '../repositories/reservation.repository';
import { CreateReservationInput } from './input/create.input';
import { SlotNotAvailableError } from './errors/slot-not-available.error';
import { Either, left, right } from '@/core/either/either';
import { Reservation } from '../../enterprise/entities/reservation.entities';
import { ReservationNotCreatedError } from './errors/reservation-not-created.error';

type Response = Either<
  SlotNotAvailableError | ReservationNotCreatedError,
  { reservationId: string }
>;

@Injectable()
export class CreateReservationUseCase {
  constructor(private reservations: ReservationRepository) {}

  async execute(data: CreateReservationInput): Promise<Response> {
    const { passengerId, slotId } = data;
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
      // TODO: Log error
      return left(new ReservationNotCreatedError());
    }

    return right({
      reservationId: reservation.id,
    });
  }
}
