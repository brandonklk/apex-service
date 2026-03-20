import { Module } from '@nestjs/common';
import { AppConfigModule } from './modules/reservations/infra/config/config.module';
import { HttpModule } from './modules/reservations/interfaces/http/http.module';

@Module({
  imports: [AppConfigModule, HttpModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
