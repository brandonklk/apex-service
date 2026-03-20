import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationResponse {
  @ApiProperty({
    type: 'string',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'UUID da reserva criada',
  })
  id: string;
}
