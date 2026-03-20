import { GetReservationMapper } from './get.mapper';

describe('GetReservationMapper', () => {
  it('should map id to GetReservationInput correctly', () => {
    const id = 'reservation-123';

    const result = GetReservationMapper.toInput(id);

    expect(result).toEqual({
      id,
    });
  });

  it('should return object with same id reference', () => {
    const id = 'abc-456';

    const result = GetReservationMapper.toInput(id);

    expect(result.id).toBe(id);
  });

  it('should return object with same id null', () => {
    const id = null;

    const result = GetReservationMapper.toInput(id as unknown as string);

    expect(result.id).toBeNull();
  });
});
