import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "node",
    env: {
      DATABASE_URL:
        process.env.DATABASE_URL ??
        "postgresql://salescoach:salescoach@localhost:5435/salescoach_test?schema=public",
      AUTH_SECRET: process.env.AUTH_SECRET ?? "test-secret",
    },
  },
});
