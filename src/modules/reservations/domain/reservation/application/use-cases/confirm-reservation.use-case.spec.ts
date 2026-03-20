import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { right, left } from '@/core/either/either';
import { ConfirmReservationUseCase } from '@/modules/reservations/domain/reservation/application/use-cases/confirm-reservation.use-case';
import { ReservationRepository } from '@/modules/reservations/domain/reservation/application/repositories/reservation.repository';
import { Reservation } from '@/modules/reservations/domain/reservation/enterprise/entities/reservation.entities';
import { ReservationStatus } from '@/modules/reservations/domain/reservation/enterprise/enums/reservation-status';

describe('ConfirmReservationUseCase', () => {
  let useCase: ConfirmReservationUseCase;
  let repositoryMock: ReservationRepository;

  beforeEach(() => {
    repositoryMock = {
      findById: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
      findReservedByFilterAndPaginated: jest.fn(),
      findReservedBySlotAndDateAndPassenger: jest.fn(),
    } as unknown as ReservationRepository;

    useCase = new ConfirmReservationUseCase(repositoryMock);
  });

  describe('success cases', () => {
    it('should confirm a pending reservation', async () => {
      const reservationId = '550e8400-e29b-41d4-a716-446655440000';

      const mockReservation = {
        id: reservationId,
        status: ReservationStatus.PENDING,
        confirm: jest.fn().mockReturnValue(right(undefined)),
      } as unknown as Reservation;

      jest.mocked(repositoryMock.findById).mockResolvedValue(mockReservation);
      jest.mocked(repositoryMock.update).mockResolvedValue(undefined);

      const result = await useCase.execute({ id: reservationId });

      expect(result.isRight()).toBe(true);
      expect(result.getRight()).toEqual({
        reservationId,
      });
      expect(mockReservation.confirm).toHaveBeenCalled();
      expect(repositoryMock.update).toHaveBeenCalled();
    });
  });

  describe('error cases', () => {
    it('should return error when reservation not found', async () => {
      jest.mocked(repositoryMock.findById).mockResolvedValue(null);

      const result = await useCase.execute({
        id: '550e8400-e29b-41d4-a716-446655440000',
      });

      expect(result.isLeft()).toBe(true);
    });

    it('should prevent confirmation of already confirmed reservations', async () => {
      const mockReservation = {
        id: 'test-id',
        status: ReservationStatus.CONFIRMED,
        confirm: jest
          .fn()
          .mockReturnValue(left(new Error('Already confirmed'))),
      } as unknown as Reservation;

      jest.mocked(repositoryMock.findById).mockResolvedValue(mockReservation);

      const result = await useCase.execute({ id: 'test-id' });

      expect(result.isLeft()).toBe(true);
    });

    it('should prevent confirmation of cancelled reservations', async () => {
      const mockReservation = {
        id: 'test-id',
        status: ReservationStatus.CANCELLED,
        confirm: jest
          .fn()
          .mockReturnValue(
            left(new Error('Cannot confirm cancelled reservation')),
          ),
      } as unknown as Reservation;

      jest.mocked(repositoryMock.findById).mockResolvedValue(mockReservation);

      const result = await useCase.execute({ id: 'test-id' });

      expect(result.isLeft()).toBe(true);
    });

    it('should prevent confirmation if slot is no longer available', async () => {
      const mockReservation = {
        id: 'test-id',
        slotId: 'slot-1',
        passengerId: 'passenger-1',
        date: new Date(),
        status: ReservationStatus.PENDING,
        confirm: jest.fn().mockReturnValue(undefined),
      } as unknown as Reservation;

      // Simula que outro passageiro já confirmou neste slot
      jest.mocked(repositoryMock.findById).mockResolvedValue(mockReservation);
      jest
        .mocked(repositoryMock.findReservedBySlotAndDateAndPassenger)
        .mockResolvedValue({
          id: 'other-reservation-id',
          passengerId: 'other-passenger',
          slotId: 'slot-1',
          date: new Date(),
          status: ReservationStatus.CONFIRMED,
        } as Reservation);

      const result = await useCase.execute({ id: 'test-id' });

      expect(result.isLeft()).toBe(true);
    });
  });
});
