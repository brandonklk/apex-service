import { z } from 'zod';

export const createReservationSchema = z.object({
  passengerId: z.uuid({ version: 'v4' }),
  slotId: z.uuid({ version: 'v4' }),
});
