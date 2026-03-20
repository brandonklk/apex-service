import { PrismaReservationMapper } from './prisma-reservation.mapper';
import { Reservation } from '@/modules/reservations/domain/reservation/enterprise/entities/reservation.entities';
import { ReservationStatus } from '@/modules/reservations/domain/reservation/enterprise/enums/reservation-status';

describe('PrismaReservationMapper', () => {
  const reservation = Reservation.build({
    id: 'res-1',
    slotId: 'slot-1',
    passengerId: 'pass-1',
    date: new Date('2026-03-20'),
    status: ReservationStatus.CONFIRMED,
  });

  it('should map domain to prisma', () => {
    const prisma = PrismaReservationMapper.toPrisma(reservation);
    expect(prisma).toEqual({
      id: reservation.id,
      slotId: reservation.slotId,
      passengerId: reservation.passengerId,
      date: reservation.date,
      status: reservation.status,
    });
  });

  it('should map prisma to domain', () => {
    const data = {
      id: 'res-1',
      slotId: 'slot-1',
      passengerId: 'pass-1',
      date: '2026-03-20T00:00:00.000Z',
      status: 'CONFIRMED',
    };
    const domain = PrismaReservationMapper.toDomain(data);

    expect(domain).toBeInstanceOf(Reservation);
    expect(domain.id).toBe(data.id);
    expect(domain.date).toEqual(new Date(data.date));
    expect(domain.status).toBe(ReservationStatus.CONFIRMED);
  });
});
