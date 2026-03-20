import { ConfirmReservationUseCase } from '@/modules/reservations/domain/reservation/application/use-cases/confirm-reservation.use-case';
import { ConfirmReservationPresenter } from '../presenters/confirm-reservation.presenter';
import { ConfirmReservationController } from './confirm.controller';
import { ConfirmReservationMapper } from '../mappers/confirm.mapper';
import { HttpErrorMapper } from '../mappers/http-error.mapper';
import { left, right } from '@/core/either/either';

describe('ConfirmReservationController', () => {
  let controller: ConfirmReservationController;
  let useCase: Partial<ConfirmReservationUseCase>;

  beforeEach(async () => {
    useCase = { execute: jest.fn() };
    controller = new ConfirmReservationController(useCase as any);
  });

  it('should confirm reservation successfully', async () => {
    const id = 'uuid-test';
    const input = ConfirmReservationMapper.toInput(id);
    const output = { reservationId: id };

    (useCase.execute as jest.Mock).mockResolvedValue(right(output));

    const result = await controller.handle(id);

    expect(result).toEqual(ConfirmReservationPresenter.toHTTP(output));
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
