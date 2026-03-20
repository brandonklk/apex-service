import { CreateReservationPresenter } from '../presenters/create-reservation.presenter';
import { left, right } from '@/core/either/either';
import { HttpErrorMapper } from '../mappers/http-error.mapper';
import { CreateReservationController } from './create.controller';
import { CreateReservationUseCase } from '@/modules/reservations/domain/reservation/application/use-cases/create-reservation.use-case';
import { CreateReservationMapper } from '../mappers/create.mapper';

describe('CreateReservationController', () => {
  let controller: CreateReservationController;
  let useCase: Partial<CreateReservationUseCase>;

  beforeEach(() => {
    useCase = { execute: jest.fn() };
    controller = new CreateReservationController(useCase as any);
  });

  it('should create reservation successfully', async () => {
    const body = { passengerId: 'p1', slotId: 's1' };
    const input = CreateReservationMapper.toInput(body);
    const reservation = { reservationId: 'res-1' };

    (useCase.execute as jest.Mock).mockResolvedValue(right(reservation));

    const result = await controller.handle(body);

    expect(result).toEqual(CreateReservationPresenter.toHTTP(reservation));
    expect(useCase.execute).toHaveBeenCalledWith(input);
  });

  it('should throw mapped HTTP error on left result', async () => {
    const body = { passengerId: 'p1', slotId: 's1' };
    const error = new Error('fail');

    (useCase.execute as jest.Mock).mockResolvedValue(left(error));

    await expect(controller.handle(body)).rejects.toThrow(
      HttpErrorMapper.toHttp(error),
    );
  });
});
