import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['src/**/*.(t|j)s'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  coveragePathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/src/generated/',
    '<rootDir>/src/modules/reservations/infra/config',
    '<rootDir>/src/modules/reservations/domain/reservation/enterprise/',
    '<rootDir>/src/modules/reservations/infra/database/prisma/',
    '<rootDir>/src/modules/reservations/interfaces/http/',
    '<rootDir>/src/app.module.ts',
    '<rootDir>/src/main.ts',
  ],

  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};

export default config;
