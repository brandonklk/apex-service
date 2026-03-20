import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { CreateReservationUseCase } from '@/modules/reservations/domain/reservation/application/use-cases/create-reservation.use-case';
import { ReservationRepository } from '@/modules/reservations/domain/reservation/application/repositories/reservation.repository';
import { Reservation } from '@/modules/reservations/domain/reservation/enterprise/entities/reservation.entities';
import { ReservationStatus } from '@/modules/reservations/domain/reservation/enterprise/enums/reservation-status';

describe('CreateReservationUseCase', () => {
  let useCase: CreateReservationUseCase;
  let repositoryMock: ReservationRepository;
  let loggerMock: any;

  beforeEach(() => {
    repositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findReservedByFilterAndPaginated: jest.fn(),
      findReservedBySlotAndDateAndPassenger: jest.fn(),
      update: jest.fn(),
    } as unknown as ReservationRepository;

    loggerMock = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    };

    useCase = new CreateReservationUseCase(repositoryMock, loggerMock);
  });

  describe('success cases', () => {
    it('should create a new reservation successfully', async () => {
      const input = {
        passengerId: '550e8400-e29b-41d4-a716-446655440000',
        slotId: '550e8400-e29b-41d4-a716-446655440001',
      };

      jest.mocked(repositoryMock.create).mockResolvedValue(undefined);

      const result = await useCase.execute(input);

      expect(result.isRight()).toBe(true);
      expect(result.getRight()).toEqual({ reservationId: expect.any(String) });
      expect(repositoryMock.create).toHaveBeenCalledWith(expect.any(Object));
    });

    it('should create reservation with valid UUID format', async () => {
      const input = {
        passengerId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        slotId: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
      };

      jest.mocked(repositoryMock.create).mockResolvedValue(undefined);

      const result = await useCase.execute(input);

      expect(result.isRight()).toBe(true);
    });
  });

  describe('error cases', () => {
    it('should return SlotNotAvailableError if reservation already exists', async () => {
      const input = {
        passengerId: '550e8400-e29b-41d4-a716-446655440000',
        slotId: '550e8400-e29b-41d4-a716-446655440001',
      };

      // Simula que já existe uma reserva
      jest
        .mocked(repositoryMock.findReservedBySlotAndDateAndPassenger)
        .mockResolvedValue({
          id: 'existing-id',
          passengerId: input.passengerId,
          slotId: input.slotId,
          date: new Date(),
          status: ReservationStatus.PENDING,
        } as Reservation);

      // Mock pode variar conforme implementação real
      // Aqui é um exemplo genérico

      const result = await useCase.execute(input);
      expect(result.isLeft()).toBe(true);
    });

    it('should return error if repository.create fails', async () => {
      const input = {
        passengerId: '550e8400-e29b-41d4-a716-446655440000',
        slotId: '550e8400-e29b-41d4-a716-446655440001',
      };

      jest
        .mocked(repositoryMock.create)
        .mockRejectedValue(new Error('DB Error'));

      const result = await useCase.execute(input);

      expect(result.isLeft()).toBe(true);
    });

    it('should handle empty passengerId', async () => {
      const input = {
        passengerId: '',
        slotId: '550e8400-e29b-41d4-a716-446655440001',
      };

      const result = await useCase.execute(input);
      expect(result.isLeft()).toBe(true);
    });

    it('should handle empty slotId', async () => {
      const input = {
        passengerId: '550e8400-e29b-41d4-a716-446655440000',
        slotId: '',
      };

      const result = await useCase.execute(input);
      expect(result.isLeft()).toBe(true);
    });
  });
});
