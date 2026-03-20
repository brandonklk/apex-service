import { z } from 'zod';

export const checkInReservationSchema = z.uuid({ version: 'v4' });
