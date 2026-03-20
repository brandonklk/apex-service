import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { ListReservationUseCase } from '@/modules/reservations/domain/reservation/application/use-cases/list-reservation.use-case';
import { ListReservationMapper } from '../mappers/list.mapper';
import { ListReservationPresenter } from '../presenters/list-reservation.presenter';
import { HttpErrorMapper } from '../mappers/http-error.mapper';
import { ListReservationResponse } from '../dtos/list-reservation.response';
import { ListReservationRequest } from '../dtos/list-reservation.request';

@Controller('reservations')
export class ListReservationController {
  constructor(private useCase: ListReservationUseCase) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar reservas' })
  @ApiOkResponse({ type: ListReservationResponse })
  async handle(@Query() query: ListReservationRequest) {
    const input = ListReservationMapper.toInput(query);

    const result = await this.useCase.execute(input);

    if (result.isLeft()) {
      throw HttpErrorMapper.toHttp(result.value);
    }

    return ListReservationPresenter.toHTTP(result.value);
  }
}
