/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['<rootDir>/tests/**/*.test.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/server.ts', '!src/types/**'],
  coverageDirectory: 'coverage',
  // No coverage threshold gate by default — a fresh template starts with
  // minimal coverage. Add a `coverageThreshold` block here once you have a
  // meaningful test suite, and CI will enforce it automatically.
  clearMocks: true,
  verbose: true,
};
