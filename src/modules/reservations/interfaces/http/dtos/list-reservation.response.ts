import { ApiProperty } from '@nestjs/swagger';
import { GetReservationResponse } from './get-reservation.response';

export class ListReservationResponse {
  @ApiProperty({ type: [GetReservationResponse] })
  data: GetReservationResponse[];

  @ApiProperty()
  pagination: {
    total: number;
    page: number;
    size: number;
  };
}
