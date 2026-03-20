import { ReservationStatus } from '../../../enterprise/enums/reservation-status';

export type ReservationFilter = {
  status?: ReservationStatus;
  date?: Date;
  slotId?: string;
};
