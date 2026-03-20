import { CheckInReservationMapper } from './check-in.mapper';

describe('CheckInReservationMapper', () => {
  it('should map id to CheckInReservationInput correctly', () => {
    const id = 'reservation-123';

    const result = CheckInReservationMapper.toInput(id);

    expect(result).toEqual({
      id,
    });
  });

  it('should return object with same id reference', () => {
    const id = 'abc-456';

    const result = CheckInReservationMapper.toInput(id);

    expect(result.id).toBe(id);
  });

  it('should return object with same id null', () => {
    const id = null;

    const result = CheckInReservationMapper.toInput(id as unknown as string);

    expect(result.id).toBeNull();
  });
});
