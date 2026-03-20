import { ListReservationMapper } from './list.mapper';

describe('ListReservationMapper', () => {
  it('should map ListReservationRequest to ListReservationInput', () => {
    const dto = {
      status: 'CONFIRMED',
      date: new Date('2026-03-20'),
      slotId: 'slot-123',
      page: 1,
      size: 10,
    };

    const result = ListReservationMapper.toInput(dto as any);

    expect(result).toEqual({
      status: dto.status,
      date: dto.date,
      slotId: dto.slotId,
      page: dto.page,
      size: dto.size,
    });
  });

  it('should preserve all field values correctly', () => {
    const dto = {
      status: 'PENDING',
      date: new Date(),
      slotId: 'slot-999',
      page: 2,
      size: 20,
    };

    const result = ListReservationMapper.toInput(dto as any);

    expect(result.status).toBe(dto.status);
    expect(result.date).toBe(dto.date);
    expect(result.slotId).toBe(dto.slotId);
    expect(result.page).toBe(dto.page);
    expect(result.size).toBe(dto.size);
  });

  it('should handle undefined optional fields', () => {
    const dto = {
      status: undefined,
      date: undefined,
      slotId: undefined,
      page: undefined,
      size: undefined,
    };

    const result = ListReservationMapper.toInput(dto as any);

    expect(result).toEqual({
      status: undefined,
      date: undefined,
      slotId: undefined,
      page: undefined,
      size: undefined,
    });
  });
});
