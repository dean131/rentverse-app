/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: "ts-jest/presets/default-esm", // Use the ESM preset for ts-jest
  testEnvironment: "node",
  // The 'extensionsToTreatAsEsm' option is important for ts-jest in ESM mode
  extensionsToTreatAsEsm: [".ts"],
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
  moduleNameMapper: {
    // This helps resolve the .js extension in imports
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  testPathIgnorePatterns: ["/node_modules/", "/__tests__/setup.ts"],
};
