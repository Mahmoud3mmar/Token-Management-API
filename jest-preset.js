module.exports = {
  // You can customize this preset as needed
  moduleFileExtensions: ['js', 'json', 'ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testRegex: '.e2e-spec.ts$',
  testEnvironment: 'node',
  coverageDirectory: 'coverage/e2e',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{js,ts}'],
  testTimeout: 30000,
};
