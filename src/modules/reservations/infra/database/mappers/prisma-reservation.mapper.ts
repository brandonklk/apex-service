import { Reservation } from '@/modules/reservations/domain/reservation/enterprise/entities/reservation.entities';
import { ReservationStatus } from '@/modules/reservations/domain/reservation/enterprise/enums/reservation-status';

export class PrismaReservationMapper {
  static toPrisma(reservation: Reservation) {
    return {
      id: reservation.id,
      slotId: reservation.slotId,
      passengerId: reservation.passengerId,
      date: reservation.date,
      status: reservation.status,
    };
  }

  static toDomain(data: any): Reservation {
    return Reservation.build({
      id: data.id,
      slotId: data.slotId,
      passengerId: data.passengerId,
      date: new Date(data.date),
      status: data.status as ReservationStatus,
    });
  }
}
