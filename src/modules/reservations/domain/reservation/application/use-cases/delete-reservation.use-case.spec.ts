import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { right, left } from '@/core/either/either';
import { DeleteReservationUseCase } from '@/modules/reservations/domain/reservation/application/use-cases/delete-reservation.use-case';
import { ReservationRepository } from '@/modules/reservations/domain/reservation/application/repositories/reservation.repository';
import { Reservation } from '@/modules/reservations/domain/reservation/enterprise/entities/reservation.entities';
import { ReservationStatus } from '@/modules/reservations/domain/reservation/enterprise/enums/reservation-status';

describe('DeleteReservationUseCase', () => {
  let useCase: DeleteReservationUseCase;
  let repositoryMock: ReservationRepository;

  beforeEach(() => {
    repositoryMock = {
      findById: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
      findReservedByFilterAndPaginated: jest.fn(),
      findReservedBySlotAndDateAndPassenger: jest.fn(),
    } as unknown as ReservationRepository;

    useCase = new DeleteReservationUseCase(repositoryMock);
  });

  describe('success cases', () => {
    it('should delete a pending reservation', async () => {
      const reservationId = '550e8400-e29b-41d4-a716-446655440000';
      const futureDate = new Date(Date.now() + 5 * 60 * 60 * 1000); // 5 hours from now

      const mockReservation = {
        id: reservationId,
        date: futureDate,
        status: ReservationStatus.PENDING,
        cancel: jest.fn().mockReturnValue(right(undefined)), // Não lança erro
      } as unknown as Reservation;

      jest.mocked(repositoryMock.findById).mockResolvedValue(mockReservation);
      jest.mocked(repositoryMock.update).mockResolvedValue(undefined);

      const result = await useCase.execute({ id: reservationId });

      expect(result.isRight()).toBe(true);
      expect(repositoryMock.update).toHaveBeenCalled();
    });

    it('should delete a confirmed reservation with enough time', async () => {
      const reservationId = '550e8400-e29b-41d4-a716-446655440000';
      const futureDate = new Date(Date.now() + 10 * 60 * 60 * 1000); // 10 hours from now

      const mockReservation = {
        id: reservationId,
        date: futureDate,
        status: ReservationStatus.CONFIRMED,
        cancel: jest.fn().mockReturnValue(right(undefined)),
      } as unknown as Reservation;

      jest.mocked(repositoryMock.findById).mockResolvedValue(mockReservation);
      jest.mocked(repositoryMock.update).mockResolvedValue(undefined);

      const result = await useCase.execute({ id: reservationId });

      expect(result.isRight()).toBe(true);
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

    it('should prevent deletion of completed reservations', async () => {
      const mockReservation = {
        id: 'test-id',
        status: ReservationStatus.COMPLETED,
        cancel: jest.fn().mockReturnValue(left(new Error('Cannot cancel completed reservation'))),
      } as unknown as Reservation;

      jest.mocked(repositoryMock.findById).mockResolvedValue(mockReservation);

      const result = await useCase.execute({ id: 'test-id' });

      expect(result.isLeft()).toBe(true);
    });

    it('should prevent deletion of checked-in reservations', async () => {
      const mockReservation = {
        id: 'test-id',
        status: ReservationStatus.CHECKED_IN,
        cancel: jest.fn().mockReturnValue(left(new Error('Cannot cancel checked-in reservation'))),
      } as unknown as Reservation;

      jest.mocked(repositoryMock.findById).mockResolvedValue(mockReservation);

      const result = await useCase.execute({ id: 'test-id' });

      expect(result.isLeft()).toBe(true);
    });

    it('should prevent deletion when less than 4 hours to reservation', async () => {
      const soonDate = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours from now

      const mockReservation = {
        id: 'test-id',
        date: soonDate,
        status: ReservationStatus.CONFIRMED,
        cancel: jest.fn().mockReturnValue(left(new Error('Cannot cancel within 4 hours'))),
      } as unknown as Reservation;

      jest.mocked(repositoryMock.findById).mockResolvedValue(mockReservation);

      const result = await useCase.execute({ id: 'test-id' });

      expect(result.isLeft()).toBe(true);
    });

    it('should handle repository update errors', async () => {
      const futureDate = new Date(Date.now() + 5 * 60 * 60 * 1000);

      const mockReservation = {
        id: 'test-id',
        date: futureDate,
        status: ReservationStatus.PENDING,
        cancel: jest.fn().mockReturnValue(right(undefined)),
      } as unknown as Reservation;

      jest.mocked(repositoryMock.findById).mockResolvedValue(mockReservation);
      jest
        .mocked(repositoryMock.update)
        .mockRejectedValue(new Error('DB Error'));

      const result = await useCase.execute({ id: 'test-id' });

      expect(result.isLeft()).toBe(true);
    });
  });
});
