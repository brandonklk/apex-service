import { Injectable } from '@nestjs/common';

import { ReservationRepository } from '../repositories/reservation.repository';
import { Either, left, right } from '@/core/either/either';
import { GetReservationInput } from './input/get.input';
import { ReservationNotFoundError } from './errors/reservation-not-found.error';
import { Reservation } from '../../enterprise/entities/reservation.entities';

type Response = Either<ReservationNotFoundError, Reservation>;

@Injectable()
export class GetReservationUseCase {
  constructor(private reservations: ReservationRepository) {}

  async execute(data: GetReservationInput): Promise<Response> {
    const { id: reservationId } = data;
    const reservationData = await this.reservations.findById(reservationId);

    if (!reservationData) {
      return left(new ReservationNotFoundError(reservationId));
    }

    return right(reservationData);
  }
}
