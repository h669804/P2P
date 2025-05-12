import type { Config } from "jest";

const config: Config = {
  testEnvironment: "jsdom",
  setupFiles: ["./jest.setup.ts"], // <- endret fra setupFilesAfterEnv
  testMatch: ["**/tests/**/*.test.ts?(x)"],
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "tsconfig.jest.json" }],
  },
  moduleNameMapper: {
    "\\.(css|scss)$": "identity-obj-proxy",
  },
};

export default config;
