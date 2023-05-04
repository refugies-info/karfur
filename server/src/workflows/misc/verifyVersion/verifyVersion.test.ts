import verifyVersion from "./verifyVersion";

describe("verifyVersion", () => {
  it("should resolves true when minimum version is under provided once", () => {
    process.env.MINIMUM_APP_VERSION = "2000.01.1";
    expect(verifyVersion("2023.01.1")).resolves.toBe(true);
  });
  it("should resolves true when minimum version is equal to provided once", () => {
    process.env.MINIMUM_APP_VERSION = "2023.01.1";
    expect(verifyVersion("2023.01.1")).resolves.toBe(true);
  });
  it("should resolves false when minimum version is supperior to provided once (inc)", () => {
    process.env.MINIMUM_APP_VERSION = "2023.01.2";
    expect(verifyVersion("2023.01.1")).resolves.toBe(false);
  });
  it("should resolves false when minimum version is supperior to provided once (month)", () => {
    process.env.MINIMUM_APP_VERSION = "2023.02.1";
    expect(verifyVersion("2023.01.1")).resolves.toBe(false);
  });
  it("should resolves false when minimum version is supperior to provided once (year)", () => {
    process.env.MINIMUM_APP_VERSION = "2024.01.1";
    expect(verifyVersion("2023.01.1")).resolves.toBe(false);
  });
});
