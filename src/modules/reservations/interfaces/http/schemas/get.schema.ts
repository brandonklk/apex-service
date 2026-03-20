import { z } from 'zod';

export const getReservationSchema = z.uuid({ version: 'v4' });
