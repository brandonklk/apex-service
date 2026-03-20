import { createZodDto } from 'nestjs-zod';
import { createReservationSchema } from '../schemas/create.schema';

export class CreateReservationRequest extends createZodDto(
  createReservationSchema,
) {}
