import { z } from 'zod';

export const confirmReservationSchema = z.uuid({ version: 'v4' });
