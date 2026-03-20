import { ConfirmReservationMapper } from './confirm.mapper';

describe('ConfirmReservationMapper', () => {
  it('should map id to ConfirmReservationMapper correctly', () => {
    const id = 'reservation-123';

    const result = ConfirmReservationMapper.toInput(id);

    expect(result).toEqual({
      id,
    });
  });

  it('should return object with same id reference', () => {
    const id = 'abc-456';

    const result = ConfirmReservationMapper.toInput(id);

    expect(result.id).toBe(id);
  });

  it('should return object with same id null', () => {
    const id = null;

    const result = ConfirmReservationMapper.toInput(id as unknown as string);

    expect(result.id).toBeNull();
  });
});
