import { ListReservationPresenter } from './list-reservation.presenter';

describe('ListReservationPresenter', () => {
  it('should map paginated reservations correctly', () => {
    const reservations = [
      {
        id: 'res-1',
        slotId: 'slot-1',
        passengerId: 'pass-1',
        date: new Date('2026-03-20'),
        status: 'CONFIRMED',
      },
      {
        id: 'res-2',
        slotId: 'slot-2',
        passengerId: 'pass-2',
        date: new Date('2026-03-21'),
        status: 'PENDING',
      },
    ];

    const input = {
      data: reservations,
      total: 2,
      page: 1,
      size: 10,
    } as any;

    const result = ListReservationPresenter.toHTTP(input);

    expect(result).toEqual({
      data: reservations.map((r) => ({
        id: r.id,
        slotId: r.slotId,
        passengerId: r.passengerId,
        date: r.date,
        status: r.status,
      })),
      pagination: {
        total: 2,
        page: 1,
        size: 10,
      },
    });
  });

  it('should handle empty list', () => {
    const input = {
      data: [],
      total: 0,
      page: 1,
      size: 10,
    } as any;

    const result = ListReservationPresenter.toHTTP(input);

    expect(result.data).toEqual([]);
    expect(result.pagination).toEqual({
      total: 0,
      page: 1,
      size: 10,
    });
  });

  it('should preserve item references correctly', () => {
    const reservation = {
      id: 'res-1',
      slotId: 'slot-1',
      passengerId: 'pass-1',
      date: new Date(),
      status: 'CONFIRMED',
    };

    const input = {
      data: [reservation],
      total: 1,
      page: 1,
      size: 10,
    } as any;

    const result = ListReservationPresenter.toHTTP(input);

    expect(result.data[0].id).toBe(reservation.id);
    expect(result.data[0].date).toBe(reservation.date);
  });

  it('should map pagination correctly', () => {
    const input = {
      data: [],
      total: 100,
      page: 5,
      size: 20,
    } as any;

    const result = ListReservationPresenter.toHTTP(input);

    expect(result.pagination.total).toBe(100);
    expect(result.pagination.page).toBe(5);
    expect(result.pagination.size).toBe(20);
  });

  it('should handle multiple items with different statuses', () => {
    const reservations = [
      {
        id: '1',
        slotId: 's1',
        passengerId: 'p1',
        date: new Date(),
        status: 'PENDING',
      },
      {
        id: '2',
        slotId: 's2',
        passengerId: 'p2',
        date: new Date(),
        status: 'CONFIRMED',
      },
      {
        id: '3',
        slotId: 's3',
        passengerId: 'p3',
        date: new Date(),
        status: 'CANCELLED',
      },
    ];

    const input = {
      data: reservations,
      total: 3,
      page: 1,
      size: 10,
    } as any;

    const result = ListReservationPresenter.toHTTP(input);

    result.data.forEach((item, index) => {
      expect(item.status).toBe(reservations[index].status);
    });
  });
});
