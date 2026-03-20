import { ApiProperty } from '@nestjs/swagger';
import { ReservationStatus } from '@/modules/reservations/domain/reservation/enterprise/enums/reservation-status';

export class GetReservationResponse {
  @ApiProperty({ type: 'string', format: 'uuid' })
  id: string;

  @ApiProperty({ type: 'string', format: 'uuid' })
  passengerId: string;

  @ApiProperty({ type: 'string', format: 'uuid' })
  slotId: string;

  @ApiProperty({ type: Date, format: 'date-time' })
  date: Date;

  @ApiProperty({ enum: ReservationStatus })
  status: ReservationStatus;
}
