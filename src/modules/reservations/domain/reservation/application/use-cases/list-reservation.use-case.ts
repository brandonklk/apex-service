import { Injectable } from '@nestjs/common';
import { ReservationRepository } from '../repositories/reservation.repository';
import { Either, left, right } from '@/core/either/either';
import { ListReservationInput } from './input/list.input';
import { PaginatedResult } from '../repositories/types/paginated-result';
import { Reservation } from '../../enterprise/entities/reservation.entities';
import { ReservationError } from './errors/reservation.error';

type Response = Either<ReservationError, PaginatedResult<Reservation>>;

@Injectable()
export class ListReservationUseCase {
  constructor(private reservations: ReservationRepository) {}

  async execute(data: ListReservationInput): Promise<Response> {
    const { date, slotId, status, page, size } = data;

    try {
      const reservationData =
        await this.reservations.findReservedByFilterAndPaginated({
          filter: { date, slotId, status },
          pagination: { page, size },
        });
      return right(reservationData);
    } catch (error) {
      return left(new ReservationError());
    }
  }
}
