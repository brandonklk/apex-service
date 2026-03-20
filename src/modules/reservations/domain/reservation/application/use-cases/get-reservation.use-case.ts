import { Injectable } from '@nestjs/common';

import { ReservationRepository } from '../repositories/reservation.repository';
import { Either, left, right } from '@/core/either/either';
import { GetReservationInput } from './input/get.input';
import { ReservationNotFoundError } from './errors/reservation-not-found.error';
import { Reservation } from '../../enterprise/entities/reservation.entities';
import { Inject } from '@nestjs/common';
import { LOGGER, Logger } from '../logger/logger';

type Response = Either<ReservationNotFoundError, Reservation>;

@Injectable()
export class GetReservationUseCase {
  constructor(
    private reservations: ReservationRepository,
    @Inject(LOGGER) private logger: Logger,
  ) {}

  async execute(data: GetReservationInput): Promise<Response> {
    const { id: reservationId } = data;

    this.logger.debug(
      `Getting reservation with ID: ${reservationId}`,
      GetReservationUseCase.name,
    );

    const reservationData = await this.reservations.findById(reservationId);

    if (!reservationData) {
      this.logger.warn(
        `Reservation with ID ${reservationId} not found`,
        GetReservationUseCase.name,
      );
      return left(new ReservationNotFoundError(reservationId));
    }

    return right(reservationData);
  }
}
