import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { ListReservationUseCase } from '@/modules/reservations/domain/reservation/application/use-cases/list-reservation.use-case';
import { ReservationRepository } from '@/modules/reservations/domain/reservation/application/repositories/reservation.repository';
import { Reservation } from '@/modules/reservations/domain/reservation/enterprise/entities/reservation.entities';
import { ReservationStatus } from '@/modules/reservations/domain/reservation/enterprise/enums/reservation-status';

describe('ListReservationUseCase', () => {
  let useCase: ListReservationUseCase;
  let repositoryMock: ReservationRepository;

  beforeEach(() => {
    repositoryMock = {
      findReservedByFilterAndPaginated: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    } as unknown as ReservationRepository;

    useCase = new ListReservationUseCase(repositoryMock);
  });

  describe('success cases', () => {
    it('should list all reservations with pagination', async () => {
      const mockReservations = [
        {
          id: '1',
          status: ReservationStatus.PENDING,
          passengerId: 'p1',
          slotId: 's1',
          date: new Date(),
        } as Reservation,
        {
          id: '2',
          status: ReservationStatus.CONFIRMED,
          passengerId: 'p2',
          slotId: 's2',
          date: new Date(),
        } as Reservation,
      ];

      jest
        .mocked(repositoryMock.findReservedByFilterAndPaginated)
        .mockResolvedValue({
          data: mockReservations,
          page: 1,
          size: 10,
          total: 2,
        });

      const result = await useCase.execute({
        page: 1,
        size: 10,
      });

      expect(result.isRight()).toBe(true);
      expect(result.getRight().data).toHaveLength(2);
      expect(result.getRight().total).toBe(2);
    });

    it('should filter by status', async () => {
      const mockReservations = [
        {
          id: '1',
          status: ReservationStatus.CONFIRMED,
        } as Reservation,
      ];

      jest
        .mocked(repositoryMock.findReservedByFilterAndPaginated)
        .mockResolvedValue({
          data: mockReservations,
          page: 1,
          size: 10,
          total: 1,
        });

      const result = await useCase.execute({
        page: 1,
        size: 10,
        status: ReservationStatus.CONFIRMED,
      });

      expect(result.isRight()).toBe(true);
      expect(
        repositoryMock.findReservedByFilterAndPaginated,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          filter: expect.objectContaining({
            status: ReservationStatus.CONFIRMED,
          }),
        }),
      );
    });

    it('should handle empty result set', async () => {
      jest
        .mocked(repositoryMock.findReservedByFilterAndPaginated)
        .mockResolvedValue({
          data: [],
          page: 1,
          size: 10,
          total: 0,
        });

      const result = await useCase.execute({
        page: 1,
        size: 10,
      });

      expect(result.isRight()).toBe(true);
      expect(result.getRight().data).toHaveLength(0);
      expect(result.getRight().total).toBe(0);
    });

    it('should handle pagination correctly', async () => {
      jest
        .mocked(repositoryMock.findReservedByFilterAndPaginated)
        .mockResolvedValue({
          data: Array(5)
            .fill(null)
            .map(
              (_, i) =>
                ({
                  id: String(i),
                }) as Reservation,
            ),
          page: 2,
          size: 5,
          total: 25,
        });

      const result = await useCase.execute({
        page: 2,
        size: 5,
      });

      expect(result.isRight()).toBe(true);
      expect(result.getRight().page).toBe(2);
      expect(result.getRight().size).toBe(5);
      expect(result.getRight().data).toHaveLength(5);
    });

    it('should filter by slotId', async () => {
      jest
        .mocked(repositoryMock.findReservedByFilterAndPaginated)
        .mockResolvedValue({
          data: [],
          page: 1,
          size: 10,
          total: 0,
        });

      const slotId = '550e8400-e29b-41d4-a716-446655440001';
      const result = await useCase.execute({
        page: 1,
        size: 10,
        slotId,
      });

      expect(result.isRight()).toBe(true);
      expect(
        repositoryMock.findReservedByFilterAndPaginated,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          filter: expect.objectContaining({
            slotId,
          }),
        }),
      );
    });

    it('should filter by date', async () => {
      const date = new Date('2026-12-25');
      jest
        .mocked(repositoryMock.findReservedByFilterAndPaginated)
        .mockResolvedValue({
          data: [],
          page: 1,
          size: 10,
          total: 0,
        });

      const result = await useCase.execute({
        page: 1,
        size: 10,
        date,
      });

      expect(result.isRight()).toBe(true);
    });
  });

  describe('error cases', () => {
    it('should handle repository errors', async () => {
      jest
        .mocked(repositoryMock.findReservedByFilterAndPaginated)
        .mockRejectedValue(new Error('DB Connection Error'));

      const result = await useCase.execute({
        page: 1,
        size: 10,
      });

      expect(result.isLeft()).toBe(true);
    });

    it('should handle invalid page number', async () => {
      const result = await useCase.execute({
        page: -1,
        size: 10,
      });

      expect(result.isLeft()).toBe(true);
    });

    it('should handle invalid size', async () => {
      const result = await useCase.execute({
        page: 1,
        size: -5,
      });

      expect(result.isLeft()).toBe(true);
    });

    it('should handle size exceeding maximum', async () => {
      const result = await useCase.execute({
        page: 1,
        size: 10000, // Muito grande
      });

      expect(result.isLeft()).toBe(true);
    });
  });
});
