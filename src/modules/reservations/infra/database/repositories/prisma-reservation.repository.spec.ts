import { Test, TestingModule } from '@nestjs/testing';
import { PrismaReservationRepository } from './prisma-reservation.repository';
import { PrismaService } from '../prisma/prisma.service';
import { Reservation } from '@/modules/reservations/domain/reservation/enterprise/entities/reservation.entities';
import { ReservationStatus } from '@/modules/reservations/domain/reservation/enterprise/enums/reservation-status';

describe('PrismaReservationRepository', () => {
  let repository: PrismaReservationRepository;
  let prisma: any;

  const reservation = Reservation.build({
    id: 'res-1',
    slotId: 'slot-1',
    passengerId: 'pass-1',
    date: new Date('2026-03-20'),
    status: ReservationStatus.CONFIRMED,
  });

  beforeEach(async () => {
    prisma = {
      reservation: {
        create: jest.fn(),
        update: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaReservationRepository,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    repository = module.get(PrismaReservationRepository);
  });

  it('should create reservation', async () => {
    await repository.create(reservation);
    expect(prisma.reservation.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ id: reservation.id }),
    });
  });

  it('should update reservation', async () => {
    await repository.update(reservation);
    expect(prisma.reservation.update).toHaveBeenCalledWith({
      where: { id: reservation.id },
      data: expect.objectContaining({ id: reservation.id }),
    });
  });

  it('should find reservation by id', async () => {
    prisma.reservation.findUnique.mockResolvedValue({
      id: reservation.id,
      slotId: reservation.slotId,
      passengerId: reservation.passengerId,
      date: reservation.date,
      status: reservation.status,
    });

    const result = await repository.findById(reservation.id);
    expect(result?.id).toBe(reservation.id);
  });

  it('should return null if findById not found', async () => {
    prisma.reservation.findUnique.mockResolvedValue(null);
    const result = await repository.findById('non-existent');
    expect(result).toBeNull();
  });

  it('should find reserved by slot, date, and passenger', async () => {
    prisma.reservation.findFirst.mockResolvedValue({
      ...reservation,
      date: reservation.date,
    });

    const result = await repository.findReservedBySlotAndDateAndPassenger(
      reservation.slotId,
      reservation.date,
      reservation.passengerId,
    );

    expect(result?.id).toBe(reservation.id);
  });

  it('should return null if findReservedBySlotAndDateAndPassenger not found', async () => {
    prisma.reservation.findFirst.mockResolvedValue(null);

    const result = await repository.findReservedBySlotAndDateAndPassenger(
      'slot-x',
      new Date(),
      'pass-x',
    );
    expect(result).toBeNull();
  });

  it('should return paginated reservations', async () => {
    const prismaData = [
      {
        id: 'res-1',
        slotId: 'slot-1',
        passengerId: 'pass-1',
        date: new Date(),
        status: ReservationStatus.CONFIRMED,
      },
    ];

    prisma.reservation.findMany.mockResolvedValue(prismaData);
    prisma.reservation.count.mockResolvedValue(1);

    const result = await repository.findReservedByFilterAndPaginated({
      filter: { status: ReservationStatus.CONFIRMED },
      pagination: { page: 1, size: 10 },
    });

    expect(result.data[0].id).toBe('res-1');
    expect(result.total).toBe(1);
    expect(result.page).toBe(1);
    expect(result.size).toBe(10);
  });

  it('should filter by slotId', async () => {
    const prismaData = [
      {
        id: 'res-1',
        slotId: 'slot-1',
        passengerId: 'pass-1',
        date: new Date(),
        status: ReservationStatus.CONFIRMED,
      },
    ];

    prisma.reservation.findMany.mockResolvedValue(prismaData);
    prisma.reservation.count.mockResolvedValue(1);

    const result = await repository.findReservedByFilterAndPaginated({
      filter: { slotId: 'slot-1' },
      pagination: { page: 1, size: 10 },
    });

    expect(prisma.reservation.findMany).toHaveBeenCalledWith({
      where: { slotId: 'slot-1' },
      skip: 0,
      take: 10,
      orderBy: { date: 'asc' },
    });
    expect(result.data[0].id).toBe('res-1');
  });

  it('should filter by date', async () => {
    const filterDate = new Date('2026-03-20');
    const prismaData = [
      {
        id: 'res-1',
        slotId: 'slot-1',
        passengerId: 'pass-1',
        date: filterDate,
        status: ReservationStatus.CONFIRMED,
      },
    ];

    prisma.reservation.findMany.mockResolvedValue(prismaData);
    prisma.reservation.count.mockResolvedValue(1);

    const result = await repository.findReservedByFilterAndPaginated({
      filter: { date: filterDate },
      pagination: { page: 1, size: 10 },
    });

    const startOfDay = new Date(filterDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(filterDate);
    endOfDay.setHours(23, 59, 59, 999);

    expect(prisma.reservation.findMany).toHaveBeenCalledWith({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      skip: 0,
      take: 10,
      orderBy: { date: 'asc' },
    });
    expect(result.data[0].id).toBe('res-1');
  });

  it('should filter by status and slotId', async () => {
    const prismaData = [
      {
        id: 'res-1',
        slotId: 'slot-1',
        passengerId: 'pass-1',
        date: new Date(),
        status: ReservationStatus.CONFIRMED,
      },
    ];

    prisma.reservation.findMany.mockResolvedValue(prismaData);
    prisma.reservation.count.mockResolvedValue(1);

    const result = await repository.findReservedByFilterAndPaginated({
      filter: { status: ReservationStatus.CONFIRMED, slotId: 'slot-1' },
      pagination: { page: 1, size: 10 },
    });

    expect(prisma.reservation.findMany).toHaveBeenCalledWith({
      where: { status: ReservationStatus.CONFIRMED, slotId: 'slot-1' },
      skip: 0,
      take: 10,
      orderBy: { date: 'asc' },
    });
    expect(result.data[0].id).toBe('res-1');
  });

  it('should filter by all filters', async () => {
    const filterDate = new Date('2026-03-20');
    const prismaData = [
      {
        id: 'res-1',
        slotId: 'slot-1',
        passengerId: 'pass-1',
        date: filterDate,
        status: ReservationStatus.CONFIRMED,
      },
    ];

    prisma.reservation.findMany.mockResolvedValue(prismaData);
    prisma.reservation.count.mockResolvedValue(1);

    const result = await repository.findReservedByFilterAndPaginated({
      filter: {
        status: ReservationStatus.CONFIRMED,
        slotId: 'slot-1',
        date: filterDate,
      },
      pagination: { page: 1, size: 10 },
    });

    const startOfDay = new Date(filterDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(filterDate);
    endOfDay.setHours(23, 59, 59, 999);

    expect(prisma.reservation.findMany).toHaveBeenCalledWith({
      where: {
        status: ReservationStatus.CONFIRMED,
        slotId: 'slot-1',
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      skip: 0,
      take: 10,
      orderBy: { date: 'asc' },
    });
    expect(result.data[0].id).toBe('res-1');
  });

  it('should handle empty filter', async () => {
    const prismaData = [
      {
        id: 'res-1',
        slotId: 'slot-1',
        passengerId: 'pass-1',
        date: new Date(),
        status: ReservationStatus.CONFIRMED,
      },
    ];

    prisma.reservation.findMany.mockResolvedValue(prismaData);
    prisma.reservation.count.mockResolvedValue(1);

    const result = await repository.findReservedByFilterAndPaginated({
      filter: {},
      pagination: { page: 1, size: 10 },
    });

    expect(prisma.reservation.findMany).toHaveBeenCalledWith({
      where: {},
      skip: 0,
      take: 10,
      orderBy: { date: 'asc' },
    });
    expect(result.data[0].id).toBe('res-1');
  });
});
