import { ReservationStatus } from '../../../enterprise/enums/reservation-status';

export type ListReservationInput = {
  status?: ReservationStatus;
  date?: Date;
  slotId?: string;
  page: number;
  size: number;
};
