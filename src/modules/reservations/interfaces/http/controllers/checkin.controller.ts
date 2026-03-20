import { Controller, HttpCode, HttpStatus, Param, Patch } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';

import { HttpErrorMapper } from '../mappers/http-error.mapper';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { CheckInReservationMapper } from '../mappers/check-in.mapper';
import { checkInReservationSchema } from '../schemas/check-in.schema';
import { CheckInReservationPresenter } from '../presenters/check-in-reservation.presenter';
import { CheckInReservationUseCase } from '@/modules/reservations/domain/reservation/application/use-cases/check-in-reservation.use-case';
import { CheckInReservationResponse } from '../dtos/checkin-reservation.response';

@Controller('reservations')
export class CheckInReservationController {
  constructor(private useCase: CheckInReservationUseCase) {}

  @Patch(':id/checkin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check-in de reserva' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    required: true,
  })
  @ApiOkResponse({ type: CheckInReservationResponse })
  async handle(
    @Param('id', new ZodValidationPipe(checkInReservationSchema)) id: string,
  ) {
    const input = CheckInReservationMapper.toInput(id);

    const result = await this.useCase.execute(input);

    if (result.isLeft()) {
      throw HttpErrorMapper.toHttp(result.value);
    }

    return CheckInReservationPresenter.toHTTP(result.value);
  }
}
