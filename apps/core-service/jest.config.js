/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    // Handle ES module file extensions
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  // This is important for ts-jest with ES Modules
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
};
