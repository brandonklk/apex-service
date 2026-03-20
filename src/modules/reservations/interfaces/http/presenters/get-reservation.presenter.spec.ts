import { GetReservationPresenter } from './get-reservation.presenter';

describe('GetReservationPresenter', () => {
  it('should map reservation entity to response', () => {
    const reservation = {
      id: 'res-1',
      slotId: 'slot-1',
      passengerId: 'pass-1',
      date: new Date('2026-03-20'),
      status: 'CONFIRMED',
    } as any;

    const result = GetReservationPresenter.toHTTP(reservation);

    expect(result).toEqual({
      id: reservation.id,
      slotId: reservation.slotId,
      passengerId: reservation.passengerId,
      date: reservation.date,
      status: reservation.status,
    });
  });

  it('should preserve date reference', () => {
    const date = new Date();

    const reservation = {
      id: 'res-1',
      slotId: 'slot-1',
      passengerId: 'pass-1',
      date,
      status: 'PENDING',
    } as any;

    const result = GetReservationPresenter.toHTTP(reservation);

    expect(result.date).toBe(date);
  });

  it('should handle different statuses', () => {
    const statuses = ['PENDING', 'CONFIRMED', 'CANCELLED'];

    statuses.forEach((status) => {
      const reservation = {
        id: 'res-1',
        slotId: 'slot-1',
        passengerId: 'pass-1',
        date: new Date(),
        status,
      } as any;

      const result = GetReservationPresenter.toHTTP(reservation);

      expect(result.status).toBe(status);
    });
  });
});
