import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';

import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { getReservationSchema } from '../schemas/get.schema';
import { GetReservationMapper } from '../mappers/get.mapper';
import { HttpErrorMapper } from '../mappers/http-error.mapper';
import { GetReservationPresenter } from '../presenters/get-reservation.presenter';
import { GetReservationUseCase } from '@/modules/reservations/domain/reservation/application/use-cases/get-reservation.use-case';
import { GetReservationResponse } from '../dtos/get-reservation.response';

@Controller('reservations')
export class GetReservationController {
  constructor(private useCase: GetReservationUseCase) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Buscar reserva por ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid', required: true })
  @ApiOkResponse({ type: GetReservationResponse })
  async handle(
    @Param('id', new ZodValidationPipe(getReservationSchema)) id: string,
  ) {
    const input = GetReservationMapper.toInput(id);

    const result = await this.useCase.execute(input);

    if (result.isLeft()) {
      const error = result.getLeft();
      throw HttpErrorMapper.toHttp(error);
    }

    return GetReservationPresenter.toHTTP(result.getRight());
  }
}
