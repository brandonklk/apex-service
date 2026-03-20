import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { GetReservationUseCase } from '@/modules/reservations/domain/reservation/application/use-cases/get-reservation.use-case';
import { ReservationRepository } from '@/modules/reservations/domain/reservation/application/repositories/reservation.repository';
import { Reservation } from '@/modules/reservations/domain/reservation/enterprise/entities/reservation.entities';
import { ReservationStatus } from '@/modules/reservations/domain/reservation/enterprise/enums/reservation-status';

describe('GetReservationUseCase', () => {
  let useCase: GetReservationUseCase;
  let repositoryMock: ReservationRepository;
  let loggerMock: any;

  beforeEach(() => {
    repositoryMock = {
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findReservedByFilterAndPaginated: jest.fn(),
    } as unknown as ReservationRepository;

    loggerMock = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    };

    useCase = new GetReservationUseCase(repositoryMock, loggerMock);
  });

  describe('success cases', () => {
    it('should return reservation by ID', async () => {
      const reservationId = '550e8400-e29b-41d4-a716-446655440000';
      const mockReservation = {
        id: reservationId,
        passengerId: 'passenger-123',
        slotId: 'slot-123',
        date: new Date('2026-12-25'),
        status: ReservationStatus.CONFIRMED,
      } as Reservation;

      jest.mocked(repositoryMock.findById).mockResolvedValue(mockReservation);

      const result = await useCase.execute({ id: reservationId });

      expect(result.isRight()).toBe(true);
      expect(result.getRight()).toEqual(mockReservation);
      expect(repositoryMock.findById).toHaveBeenCalledWith(reservationId);
    });

    it('should return reservation with different statuses', async () => {
      const statuses = [
        ReservationStatus.PENDING,
        ReservationStatus.CONFIRMED,
        ReservationStatus.CHECKED_IN,
        ReservationStatus.COMPLETED,
        ReservationStatus.CANCELLED,
      ];

      for (const status of statuses) {
        const mockReservation = {
          id: 'test-id',
          status,
        } as Reservation;

        jest.mocked(repositoryMock.findById).mockResolvedValue(mockReservation);

        const result = await useCase.execute({ id: 'test-id' });

        expect(result.isRight()).toBe(true);
        expect(result.getRight().status).toBe(status);
      }
    });
  });

  describe('error cases', () => {
    it('should return ReservationNotFoundError when reservation does not exist', async () => {
      jest.mocked(repositoryMock.findById).mockResolvedValue(null);

      const result = await useCase.execute({
        id: '550e8400-e29b-41d4-a716-446655440000',
      });

      expect(result.isLeft()).toBe(true);
    });

    it('should handle invalid UUID format', async () => {
      const result = await useCase.execute({ id: 'invalid-uuid' });

      expect(result.isLeft()).toBe(true);
    });

    it('should handle empty ID', async () => {
      const result = await useCase.execute({ id: '' });

      expect(result.isLeft()).toBe(true);
    });
  });
});
