import { ListReservationUseCase } from '@/modules/reservations/domain/reservation/application/use-cases/list-reservation.use-case';
import { ListReservationPresenter } from '../presenters/list-reservation.presenter';
import { ListReservationController } from './list.controller';
import { ListReservationMapper } from '../mappers/list.mapper';
import { left, right } from '@/core/either/either';
import { HttpErrorMapper } from '../mappers/http-error.mapper';
import { ReservationStatus } from '@/modules/reservations/domain/reservation/enterprise/enums/reservation-status';

describe('ListReservationController', () => {
  let controller: ListReservationController;
  let useCase: Partial<ListReservationUseCase>;

  beforeEach(() => {
    useCase = { execute: jest.fn() };
    controller = new ListReservationController(useCase as any);
  });

  it('should list reservations successfully', async () => {
    const query = {
      status: ReservationStatus.COMPLETED,
      date: new Date('2023-01-01'),
      slotId: 'slot-1',
      page: 1,
      size: 10,
    };

    const input = ListReservationMapper.toInput(query);
    const paginatedResult = {
      data: [
        {
          id: 'res-1',
          slotId: 'slot-1',
          passengerId: 'passenger-1',
          date: new Date('2023-01-01'),
          status: ReservationStatus.COMPLETED,
        },
      ],
      total: 1,
      page: 1,
      size: 10,
    };

    (useCase.execute as jest.Mock).mockResolvedValue(right(paginatedResult));

    const result = await controller.handle(query);

    expect(result).toEqual(
      ListReservationPresenter.toHTTP(paginatedResult as any),
    );
    expect(useCase.execute).toHaveBeenCalledWith(input);
  });

  it('should throw mapped HTTP error on left result', async () => {
    const query = { page: 1, size: 10 };
    const error = new Error('fail');

    (useCase.execute as jest.Mock).mockResolvedValue(left(error));

    await expect(controller.handle(query as any)).rejects.toThrow(
      HttpErrorMapper.toHttp(error),
    );
  });
});
