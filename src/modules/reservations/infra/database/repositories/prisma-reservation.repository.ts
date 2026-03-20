import { Injectable } from '@nestjs/common';

import { ReservationRepository } from '@/modules/reservations/domain/reservation/application/repositories/reservation.repository';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaReservationMapper } from '../mappers/prisma-reservation.mapper';
import { Reservation } from '@/modules/reservations/domain/reservation/enterprise/entities/reservation.entities';
import { ReservationStatus } from '@/modules/reservations/domain/reservation/enterprise/enums/reservation-status';
import { PaginatedResult } from '@/modules/reservations/domain/reservation/application/repositories/types/paginated-result';
import { PaginationParams } from '@/modules/reservations/domain/reservation/application/repositories/types/pagination-params';
import { ReservationFilter } from '@/modules/reservations/domain/reservation/application/repositories/types/reservation.filter';

@Injectable()
export class PrismaReservationRepository implements ReservationRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Reservation): Promise<void> {
    await this.prisma.reservation.create({
      data: PrismaReservationMapper.toPrisma(data),
    });
  }

  async update(data: Reservation): Promise<void> {
    await this.prisma.reservation.update({
      where: { id: data.id },
      data: PrismaReservationMapper.toPrisma(data),
    });
  }

  async findById(id: string): Promise<Reservation | null> {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) return null;

    return PrismaReservationMapper.toDomain(reservation);
  }

  async findReservedBySlotAndDateAndPassenger(
    slotId: string,
    date: Date,
    passengerId: string,
  ): Promise<Reservation | null> {
    const reservation = await this.prisma.reservation.findFirst({
      where: {
        slotId,
        date,
        passengerId,
        NOT: { status: ReservationStatus.CANCELLED },
      },
    });

    if (!reservation) return null;

    return PrismaReservationMapper.toDomain(reservation);
  }

  async findReservedByFilterAndPaginated(params: {
    filter?: ReservationFilter;
    pagination: PaginationParams;
  }): Promise<PaginatedResult<Reservation>> {
    const { filter, pagination } = params;
    const { page, size } = pagination;
    const where = this.buildWhereClause(filter);

    const skip = (page - 1) * size;
    const take = size;

    const [reservations, total] = await Promise.all([
      this.prisma.reservation.findMany({
        where,
        skip,
        take,
        orderBy: {
          date: 'asc',
        },
      }),
      this.prisma.reservation.count({
        where,
      }),
    ]);

    return {
      data: reservations.map(PrismaReservationMapper.toDomain),
      total,
      page,
      size,
    };
  }

  private buildWhereClause(filter?: ReservationFilter) {
    const where: any = {};

    if (filter?.status) {
      where.status = filter.status;
    }

    if (filter?.slotId) {
      where.slotId = filter.slotId;
    }

    if (filter?.date) {
      const startOfDay = new Date(filter.date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(filter.date);
      endOfDay.setHours(23, 59, 59, 999);

      where.date = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    return where;
  }
}
