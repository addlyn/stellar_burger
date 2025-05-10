module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testPathIgnorePatterns: ['/node_modules/', '/build/'],
  moduleNameMapper: {
    '@utils-types': '<rootDir>/src/utils-types',
    '^@api$': '<rootDir>/src/utils/burger-api.ts'
  }
};
