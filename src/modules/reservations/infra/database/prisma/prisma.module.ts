import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaService } from './prisma.service';
import { PrismaReservationRepository } from '../repositories/prisma-reservation.repository';
import { ReservationRepository } from '@/modules/reservations/domain/reservation/application/repositories/reservation.repository';

@Module({
  imports: [ConfigModule],
  providers: [
    PrismaService,
    {
      provide: ReservationRepository,
      useClass: PrismaReservationRepository,
    },
  ],
  exports: [ReservationRepository],
})
export class PrismaModule {}
