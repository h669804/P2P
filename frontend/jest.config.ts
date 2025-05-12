import type { Config } from "jest";

const config: Config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["./jest.setup.ts"],
  testMatch: ["**/tests/**/*.test.ts?(x)"],
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "tsconfig.jest.json" }],
  },
  moduleNameMapper: {
    "\\.(css|scss)$": "identity-obj-proxy",
    "^@/config/env$": "<rootDir>/src/config/env.jest.ts",
  },
};

export default config;
