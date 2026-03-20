import { ReservationConfirmedHandler } from './reservation-confirmed.handler';
import { ReservationConfirmedEvent } from '../reservation-confirmed.event';

describe('ReservationConfirmedHandler', () => {
  let handler: ReservationConfirmedHandler;

  beforeEach(() => {
    handler = new ReservationConfirmedHandler();
  });

  it('should log reservation confirmed event', () => {
    const event = new ReservationConfirmedEvent(
      'reservation-123',
      'slot-456',
      new Date('2026-03-20'),
    );

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    handler.handle(event);

    expect(consoleSpy).toHaveBeenCalledWith('📢 Reservation confirmed:', event);

    consoleSpy.mockRestore();
  });
});
