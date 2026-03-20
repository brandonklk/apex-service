import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { CreateReservationUseCase } from '@/modules/reservations/domain/reservation/application/use-cases/create-reservation.use-case';
import { CreateReservationMapper } from '../mappers/create.mapper';
import { CreateReservationPresenter } from '../presenters/create-reservation.presenter';
import { HttpErrorMapper } from '../mappers/http-error.mapper';
import { CreateReservationResponse } from '../dtos/create-reservation.response';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateReservationRequest } from '../dtos/create-reservation.request';

@Controller('reservations')
export class CreateReservationController {
  constructor(private useCase: CreateReservationUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar nova reserva' })
  @ApiBody({
    type: CreateReservationRequest,
    required: true,
  })
  @ApiCreatedResponse({
    type: CreateReservationResponse,
    description: 'Reserva criada com sucesso',
  })
  @ApiResponse({ status: 409, description: 'Slot não disponível' })
  @ApiResponse({ status: 500, description: 'Erro ao criar reserva' })
  async handle(@Body() body: CreateReservationRequest) {
    const input = CreateReservationMapper.toInput(body);

    const result = await this.useCase.execute(input);

    if (result.isLeft()) {
      const error = result.getLeft();
      throw HttpErrorMapper.toHttp(error);
    }

    const reservation = result.getRight();
    return CreateReservationPresenter.toHTTP(reservation);
  }
}
