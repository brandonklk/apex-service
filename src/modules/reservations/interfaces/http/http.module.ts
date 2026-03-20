import { Module } from '@nestjs/common';
import { CheckInReservationController } from './controllers/checkin.controller';
import { ConfirmReservationController } from './controllers/confirm.controller';
import { CreateReservationController } from './controllers/create.controller';
import { DeleteReservationController } from './controllers/delete.controller';
import { GetReservationController } from './controllers/get.controller';
import { ListReservationController } from './controllers/list.controller';

import { CheckInReservationUseCase } from '../../domain/reservation/application/use-cases/check-in-reservation.use-case';
import { ConfirmReservationUseCase } from '../../domain/reservation/application/use-cases/confirm-reservation.use-case';
import { CreateReservationUseCase } from '../../domain/reservation/application/use-cases/create-reservation.use-case';
import { DeleteReservationUseCase } from '../../domain/reservation/application/use-cases/delete-reservation.use-case';
import { GetReservationUseCase } from '../../domain/reservation/application/use-cases/get-reservation.use-case';
import { ListReservationUseCase } from '../../domain/reservation/application/use-cases/list-reservation.use-case';
import { PrismaModule } from '../../infra/database/prisma/prisma.module';
import { LOGGER } from '../../domain/reservation/application/logger/logger';
import { NestLoggerService } from '../../infra/logger/nest-logger.service';

@Module({
  imports: [PrismaModule],
  controllers: [
    CheckInReservationController,
    ConfirmReservationController,
    CreateReservationController,
    DeleteReservationController,
    ListReservationController,
    GetReservationController,
  ],
  providers: [
    CheckInReservationUseCase,
    ConfirmReservationUseCase,
    CreateReservationUseCase,
    DeleteReservationUseCase,
    GetReservationUseCase,
    ListReservationUseCase,
    {
      provide: LOGGER,
      useClass: NestLoggerService,
    },
  ],
})
export class HttpModule {}
