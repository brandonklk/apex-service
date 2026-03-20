import { DeleteReservationUseCase } from '@/modules/reservations/domain/reservation/application/use-cases/delete-reservation.use-case';
import { DeleteReservationController } from './delete.controller';
import { DeleteReservationMapper } from '../mappers/delete.mapper';
import { left, right } from '@/core/either/either';
import { HttpErrorMapper } from '../mappers/http-error.mapper';

describe('DeleteReservationController', () => {
  let controller: DeleteReservationController;
  let useCase: Partial<DeleteReservationUseCase>;

  beforeEach(() => {
    useCase = { execute: jest.fn() };
    controller = new DeleteReservationController(useCase as any);
  });

  it('should delete reservation successfully', async () => {
    const id = 'uuid-test';
    const input = DeleteReservationMapper.toInput(id);

    (useCase.execute as jest.Mock).mockResolvedValue(right(undefined));

    await expect(controller.handle(id)).resolves.toBeUndefined();
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
