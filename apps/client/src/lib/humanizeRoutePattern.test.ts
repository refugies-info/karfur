import { humanizeRoutePattern } from "./humanizeRoutePattern";

describe("humanizeRoutePattern", () => {
  it("should capitalize the segment and turn hyphens into spaces", () => {
    const res = humanizeRoutePattern("/download-app");
    expect(res).toEqual("Download app");
  });

  it("should join several segments", () => {
    const res = humanizeRoutePattern("/dispositif/test-preview");
    expect(res).toEqual("Dispositif test preview");
  });

  it("should strip the brackets of a dynamic segment", () => {
    const res = humanizeRoutePattern("/dispositif/[id]");
    expect(res).toEqual("Dispositif id");
  });

  it("should return an empty string when there is no readable segment", () => {
    const res = humanizeRoutePattern("/");
    expect(res).toEqual("");
  });
});
