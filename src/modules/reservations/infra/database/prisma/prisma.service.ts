import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

import { AppConfig } from '../../config/configuration';
import { PrismaClient } from '@/generated/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(config: ConfigService<AppConfig>) {
    const database = config.get<AppConfig['database']>('database')!;

    const adapter = new PrismaBetterSqlite3({
      url: database.url,
    });

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
