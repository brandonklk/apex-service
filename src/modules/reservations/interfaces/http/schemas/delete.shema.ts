import { z } from 'zod';

export const deleteReservationSchema = z.uuid({ version: 'v4' });
