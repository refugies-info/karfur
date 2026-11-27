import { getBaseUrl } from "./getBaseUrl";

describe("getBaseUrl", () => {
  it("builds the base url from NEXT_PUBLIC_REACT_APP_SITE_URL", () => {
    expect(getBaseUrl()).toBe("https://refugies.info/");
  });
});
