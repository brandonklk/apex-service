import { CreateReservationMapper } from './create.mapper';

describe('CreateReservationMapper', () => {
  it('should map CreateReservationRequest to CreateReservationInput', () => {
    const dto = {
      passengerId: 'passenger-123',
      slotId: 'slot-456',
    };

    const result = CreateReservationMapper.toInput(dto);

    expect(result).toEqual({
      passengerId: dto.passengerId,
      slotId: dto.slotId,
    });
  });

  it('should preserve values correctly', () => {
    const dto = {
      passengerId: 'p-1',
      slotId: 's-1',
    };

    const result = CreateReservationMapper.toInput(dto);

    expect(result.passengerId).toBe(dto.passengerId);
    expect(result.slotId).toBe(dto.slotId);
  });
});
