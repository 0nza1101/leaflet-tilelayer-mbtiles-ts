module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  globals: {
    "ts-jest": {
      tsconfig: './tests/tsconfig.spec.json',
    },
  },
  setupFilesAfterEnv: ['./tests/jest.setup.ts'],
};