/** @type {import('jest').Config} */
export const preset = 'ts-jest';
export const testEnvironment = 'node';
export const rootDir = '.';
export const testMatch = ['<rootDir>/tests/**/*.test.ts'];
export const collectCoverageFrom = ['src/**/*.ts', '!src/server.ts', '!src/types/**'];
export const coverageDirectory = 'coverage';
export const clearMocks = true;
export const verbose = true;
