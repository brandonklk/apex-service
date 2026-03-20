import { Controller, HttpCode, HttpStatus, Param, Patch } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';

import { HttpErrorMapper } from '../mappers/http-error.mapper';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { confirmReservationSchema } from '../schemas/confirm.shema';
import { ConfirmReservationMapper } from '../mappers/confirm.mapper';
import { ConfirmReservationPresenter } from '../presenters/confirm-reservation.presenter';
import { ConfirmReservationUseCase } from '@/modules/reservations/domain/reservation/application/use-cases/confirm-reservation.use-case';
import { ConfirmReservationResponse } from '../dtos/confirm-reservation.response';

@Controller('reservations')
export class ConfirmReservationController {
  constructor(private useCase: ConfirmReservationUseCase) {}

  @Patch(':id/confirm')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirmar reserva' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid', required: true })
  @ApiOkResponse({ type: ConfirmReservationResponse })
  async handle(
    @Param('id', new ZodValidationPipe(confirmReservationSchema)) id: string,
  ) {
    const input = ConfirmReservationMapper.toInput(id);

    const result = await this.useCase.execute(input);

    if (result.isLeft()) {
      throw HttpErrorMapper.toHttp(result.value);
    }

    return ConfirmReservationPresenter.toHTTP(result.value);
  }
}
