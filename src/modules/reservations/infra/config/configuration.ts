import { Env } from './env.schema';

export const configuration = (env: Env) => ({
  app: {
    port: env.PORT,
    env: env.NODE_ENV,
  },
  database: {
    url: env.DATABASE_URL,
  },
});

export type AppConfig = ReturnType<typeof configuration>;
