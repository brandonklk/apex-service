import { createZodDto } from 'nestjs-zod';
import { listReservationSchema } from '../schemas/list.schema';

export class ListReservationRequest extends createZodDto(
  listReservationSchema,
) {}
