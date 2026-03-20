import { CheckInReservationPresenter } from './check-in-reservation.presenter';

describe('CheckInReservationPresenter', () => {
  it('should map reservationId to id correctly', () => {
    const data = {
      reservationId: 'reservation-123',
    };

    const result = CheckInReservationPresenter.toHTTP(data);

    expect(result).toEqual({
      id: data.reservationId,
    });
  });

  it('should preserve the correct value', () => {
    const data = {
      reservationId: 'abc-456',
    };

    const result = CheckInReservationPresenter.toHTTP(data);

    expect(result.id).toBe(data.reservationId);
  });
});
