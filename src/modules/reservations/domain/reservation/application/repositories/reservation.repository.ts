import { Reservation } from '../../enterprise/entities/reservation.entities';
import { PaginatedResult } from './types/paginated-result';
import { PaginationParams } from './types/pagination-params';
import { ReservationFilter } from './types/reservation.filter';

export abstract class ReservationRepository {
  abstract create(data: Reservation): Promise<void>;
  abstract update(data: Reservation): Promise<void>;
  abstract findById(id: string): Promise<Reservation | null>;
  abstract findReservedByFilterAndPaginated(params: {
    filter?: ReservationFilter;
    pagination: PaginationParams;
  }): Promise<PaginatedResult<Reservation>>;
  abstract findReservedBySlotAndDateAndPassenger(
    slotId: string,
    date: Date,
    passengerId: string,
  ): Promise<Reservation | null>;
}
