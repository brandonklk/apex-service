import { ReservationStatus } from '@/modules/reservations/domain/reservation/enterprise/enums/reservation-status';
import { z } from 'zod';

const positiveInt = (defaultValue: number, max?: number) => {
  return z
    .union([z.string(), z.number()])
    .optional()
    .default(defaultValue)
    .pipe(
      z.union([z.string(), z.number()]).transform((val, ctx) => {
        const parsed = Number(val);

        if (isNaN(parsed)) {
          ctx.addIssue({
            code: 'custom',
            message: `The value, '${val}', is invalid.`,
          });
          return z.NEVER;
        }

        if (!Number.isInteger(parsed) || parsed <= 0) {
          ctx.addIssue({
            code: 'custom',
            message: 'Must be a positive integer greater than 0',
          });
          return z.NEVER;
        }

        if (max !== undefined && parsed > max) {
          ctx.addIssue({
            code: 'custom',
            message: `Must be less than or equal to ${max}`,
          });
          return z.NEVER;
        }

        return parsed;
      }),
    );
};

export const listReservationSchema = z.object({
  status: z.enum(ReservationStatus).optional(),

  page: positiveInt(1),

  size: positiveInt(10, 500),

  date: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    })
    .transform((val) => {
      if (!val) return undefined;

      const [year, month, day] = val.split('-').map(Number);

      return new Date(year, month - 1, day, 0, 0, 0, 0);
    }),

  slotId: z.uuid({ version: 'v4' }).optional(),
});
