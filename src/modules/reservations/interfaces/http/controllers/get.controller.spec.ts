import { GetReservationUseCase } from '@/modules/reservations/domain/reservation/application/use-cases/get-reservation.use-case';
import { GetReservationPresenter } from '../presenters/get-reservation.presenter';
import { GetReservationController } from './get.controller';
import { GetReservationMapper } from '../mappers/get.mapper';
import { left, right } from '@/core/either/either';
import { ReservationStatus } from '@/modules/reservations/domain/reservation/enterprise/enums/reservation-status';
import { HttpErrorMapper } from '../mappers/http-error.mapper';

describe('GetReservationController', () => {
  let controller: GetReservationController;
  let useCase: Partial<GetReservationUseCase>;
  let loggerMock: any;

  beforeEach(() => {
    useCase = { execute: jest.fn() };
    loggerMock = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    };

    controller = new GetReservationController(useCase as any, loggerMock);
  });

  // public readonly id: string,
  // public readonly slotId: string,
  // public readonly passengerId: string,
  // public date: Date,
  // private _status: ReservationStatus,

  it('should get reservation successfully', async () => {
    const id = 'uuid-test';
    const input = GetReservationMapper.toInput(id);
    const reservation = {
      id,
      slotId: 'slot-1',
      passengerId: 'passenger-1',
      date: new Date(),
      status: ReservationStatus.CONFIRMED,
    };

    (useCase.execute as jest.Mock).mockResolvedValue(right(reservation));

    const result = await controller.handle(id);

    expect(result).toEqual(GetReservationPresenter.toHTTP(reservation as any));
    expect(useCase.execute).toHaveBeenCalledWith(input);
  });

  it('should throw mapped HTTP error on left result', async () => {
    const id = 'uuid-test';
    const error = new Error('fail');

    (useCase.execute as jest.Mock).mockResolvedValue(left(error));

    await expect(controller.handle(id)).rejects.toThrow(
      HttpErrorMapper.toHttp(error),
    );
  });
});
