import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './configuration';
import { validateEnv } from './validate-env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
      load: [() => configuration(process.env as any)],
    }),
  ],
})
export class AppConfigModule {}
