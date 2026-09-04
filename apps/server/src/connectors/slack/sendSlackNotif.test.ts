import { getEnvPrefix } from "./sendSlackNotif";

describe("getEnvPrefix", () => {
  const nodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = nodeEnv;
  });

  it("returns no prefix in production", () => {
    process.env.NODE_ENV = "production";
    expect(getEnvPrefix()).toBe("");
  });

  it("prefixes the environment on staging", () => {
    process.env.NODE_ENV = "staging";
    expect(getEnvPrefix()).toBe("[STAGING] ");
  });

  it("prefixes the environment on a dev machine", () => {
    process.env.NODE_ENV = "dev";
    expect(getEnvPrefix()).toBe("[DEV] ");
  });

  it("falls back to LOCAL when NODE_ENV is not set", () => {
    delete process.env.NODE_ENV;
    expect(getEnvPrefix()).toBe("[LOCAL] ");
  });
});
