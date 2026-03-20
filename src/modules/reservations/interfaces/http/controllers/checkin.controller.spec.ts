import { Test, TestingModule } from '@nestjs/testing';

import { CheckInReservationUseCase } from '@/modules/reservations/domain/reservation/application/use-cases/check-in-reservation.use-case';
import { CheckInReservationController } from './checkin.controller';
import { CheckInReservationMapper } from '../mappers/check-in.mapper';
import { left, right } from '@/core/either/either';
import { CheckInReservationPresenter } from '../presenters/check-in-reservation.presenter';
import { HttpErrorMapper } from '../mappers/http-error.mapper';

describe('CheckInReservationController', () => {
  let controller: CheckInReservationController;
  let useCase: Partial<CheckInReservationUseCase>;

  beforeEach(async () => {
    useCase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CheckInReservationController],
      providers: [{ provide: CheckInReservationUseCase, useValue: useCase }],
    }).compile();

    controller = module.get(CheckInReservationController);
  });

  it('should check-in reservation successfully', async () => {
    const id = '550e8400-e29b-41d4-a716-446655440000';
    const input = CheckInReservationMapper.toInput(id);
    const output = { reservationId: id };

    (useCase.execute as jest.Mock).mockResolvedValue(right(output));

    const result = await controller.handle(id);

    expect(result).toEqual(CheckInReservationPresenter.toHTTP(output));
    expect(useCase.execute).toHaveBeenCalledWith(input);
  });

  it('should throw mapped HTTP error on left result', async () => {
    const id = '550e8400-e29b-41d4-a716-446655440000';
    const error = new Error('Test error');

    (useCase.execute as jest.Mock).mockResolvedValue(left(error));

    await expect(controller.handle(id)).rejects.toThrow(
      HttpErrorMapper.toHttp(error),
    );
  });
});
