import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { right, left } from '@/core/either/either';
import { CheckInReservationUseCase } from '@/modules/reservations/domain/reservation/application/use-cases/check-in-reservation.use-case';
import { ReservationRepository } from '@/modules/reservations/domain/reservation/application/repositories/reservation.repository';
import { Reservation } from '@/modules/reservations/domain/reservation/enterprise/entities/reservation.entities';
import { ReservationStatus } from '@/modules/reservations/domain/reservation/enterprise/enums/reservation-status';

describe('CheckInReservationUseCase', () => {
  let useCase: CheckInReservationUseCase;
  let repositoryMock: ReservationRepository;

  beforeEach(() => {
    repositoryMock = {
      findById: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
      findReservedByFilterAndPaginated: jest.fn(),
      findReservedBySlotAndDateAndPassenger: jest.fn(),
    } as unknown as ReservationRepository;

    useCase = new CheckInReservationUseCase(repositoryMock);
  });

  describe('success cases', () => {
    it('should check-in a confirmed reservation at scheduled time', async () => {
      const reservationId = '550e8400-e29b-41d4-a716-446655440000';
      const now = new Date();

      const mockReservation = {
        id: reservationId,
        date: now,
        status: ReservationStatus.CONFIRMED,
        checkIn: jest.fn().mockReturnValue(right(undefined)),
      } as unknown as Reservation;

      jest.mocked(repositoryMock.findById).mockResolvedValue(mockReservation);
      jest.mocked(repositoryMock.update).mockResolvedValue(undefined);

      const result = await useCase.execute({ id: reservationId });

      expect(result.isRight()).toBe(true);
      expect(result.getRight()).toEqual({ reservationId });
      expect(mockReservation.checkIn).toHaveBeenCalled();
      expect(repositoryMock.update).toHaveBeenCalled();
    });

    it('should check-in a confirmed reservation after scheduled time', async () => {
      const reservationId = '550e8400-e29b-41d4-a716-446655440000';
      const pastDate = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago

      const mockReservation = {
        id: reservationId,
        date: pastDate,
        status: ReservationStatus.CONFIRMED,
        checkIn: jest.fn().mockReturnValue(right(undefined)),
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

    it('should prevent check-in of pending reservations', async () => {
      const mockReservation = {
        id: 'test-id',
        status: ReservationStatus.PENDING,
        checkIn: jest
          .fn()
          .mockReturnValue(
            left(new Error('Cannot check-in pending reservation')),
          ),
      } as unknown as Reservation;

      jest.mocked(repositoryMock.findById).mockResolvedValue(mockReservation);

      const result = await useCase.execute({ id: 'test-id' });

      expect(result.isLeft()).toBe(true);
    });

    it('should prevent check-in before scheduled time', async () => {
      const futureDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

      const mockReservation = {
        id: 'test-id',
        date: futureDate,
        status: ReservationStatus.CONFIRMED,
        checkIn: jest
          .fn()
          .mockReturnValue(left(new Error('Check-in time not reached'))),
      } as unknown as Reservation;

      jest.mocked(repositoryMock.findById).mockResolvedValue(mockReservation);

      const result = await useCase.execute({ id: 'test-id' });

      expect(result.isLeft()).toBe(true);
    });

    it('should prevent duplicate check-in', async () => {
      const mockReservation = {
        id: 'test-id',
        status: ReservationStatus.CHECKED_IN,
        checkIn: jest
          .fn()
          .mockReturnValue(left(new Error('Already checked-in'))),
      } as unknown as Reservation;

      jest.mocked(repositoryMock.findById).mockResolvedValue(mockReservation);

      const result = await useCase.execute({ id: 'test-id' });

      expect(result.isLeft()).toBe(true);
    });

    it('should prevent check-in of completed reservations', async () => {
      const mockReservation = {
        id: 'test-id',
        status: ReservationStatus.COMPLETED,
        checkIn: jest
          .fn()
          .mockReturnValue(
            left(new Error('Cannot check-in completed reservation')),
          ),
      } as unknown as Reservation;

      jest.mocked(repositoryMock.findById).mockResolvedValue(mockReservation);

      const result = await useCase.execute({ id: 'test-id' });

      expect(result.isLeft()).toBe(true);
    });

    it('should handle repository update errors', async () => {
      const mockReservation = {
        id: 'test-id',
        date: new Date(),
        status: ReservationStatus.CONFIRMED,
        checkIn: jest.fn().mockReturnValue(right(undefined)),
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
