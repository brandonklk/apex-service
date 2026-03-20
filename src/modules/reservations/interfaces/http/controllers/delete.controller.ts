import {
  Controller,
  Delete,
  HttpCode,
  Param,
  HttpStatus,
} from '@nestjs/common';
import { ApiNoContentResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { deleteReservationSchema } from '../schemas/delete.shema';
import { DeleteReservationMapper } from '../mappers/delete.mapper';
import { HttpErrorMapper } from '../mappers/http-error.mapper';
import { DeleteReservationUseCase } from '@/modules/reservations/domain/reservation/application/use-cases/delete-reservation.use-case';

@Controller('reservations')
export class DeleteReservationController {
  constructor(private useCase: DeleteReservationUseCase) {}

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover reserva' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid', required: true })
  @ApiNoContentResponse({ description: 'Reserva removida com sucesso' })
  async handle(
    @Param('id', new ZodValidationPipe(deleteReservationSchema)) id: string,
  ) {
    const input = DeleteReservationMapper.toInput(id);

    const result = await this.useCase.execute(input);

    if (result.isLeft()) {
      const error = result.getLeft();
      throw HttpErrorMapper.toHttp(error);
    }
  }
}
