import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  // Runs BEFORE any test module is imported — needed so module-level env reads work
  setupFiles: ["<rootDir>/src/__mocks__/jestSetupEnv.ts"],
  // Runs after jsdom + jest framework are ready — for jest-dom matchers
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
  moduleNameMapper: {
    // Resolve Next.js path alias @/* → src/*
    "^@/(.*)$": "<rootDir>/src/$1",
    // Stub out CSS imports (mapbox-gl/dist/mapbox-gl.css etc.)
    "\\.css$": "<rootDir>/src/__mocks__/styleMock.ts",
  },
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: {
          // Jest needs CommonJS; Next's tsconfig uses "bundler" resolution
          module: "CommonJS",
          moduleResolution: "node",
          jsx: "react-jsx",
        },
      },
    ],
  },
};

export default config;
