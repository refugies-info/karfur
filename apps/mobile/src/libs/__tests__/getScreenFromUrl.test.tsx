import { getScreenFromUrl } from "../getScreenFromUrl";

describe("getScreenFromUrl", () => {
  it("should parse dispositif url", () => {
    const res1 = getScreenFromUrl("https://refugies.info/en/program/5e7c68341eaf4d0051da1126");
    expect(res1).toEqual({
      rootNavigator: "Explorer",
      screenParams: {
        screen: "ContentScreen",
        params: {
          contentId: "5e7c68341eaf4d0051da1126",
        },
      },
    });

    const res2 = getScreenFromUrl("https://refugies.info/fr/dispositif/5e7c68341eaf4d0051da1126");
    expect(res2).toEqual({
      rootNavigator: "Explorer",
      screenParams: {
        screen: "ContentScreen",
        params: {
          contentId: "5e7c68341eaf4d0051da1126",
        },
      },
    });

    const res3 = getScreenFromUrl("https://refugies.info/dispositif/5e7c68341eaf4d0051da1126");
    expect(res3).toEqual({
      rootNavigator: "Explorer",
      screenParams: {
        screen: "ContentScreen",
        params: {
          contentId: "5e7c68341eaf4d0051da1126",
        },
      },
    });
  });

  it("should parse demarche url", () => {
    const res1 = getScreenFromUrl("https://refugies.info/en/procedure/5e7c68341eaf4d0051da1126");
    expect(res1).toEqual({
      rootNavigator: "Explorer",
      screenParams: {
        screen: "ContentScreen",
        params: {
          contentId: "5e7c68341eaf4d0051da1126",
        },
      },
    });

    const res2 = getScreenFromUrl("https://refugies.info/fr/demarche/5e7c68341eaf4d0051da1126");
    expect(res2).toEqual({
      rootNavigator: "Explorer",
      screenParams: {
        screen: "ContentScreen",
        params: {
          contentId: "5e7c68341eaf4d0051da1126",
        },
      },
    });

    const res3 = getScreenFromUrl("https://refugies.info/demarche/5e7c68341eaf4d0051da1126");
    expect(res3).toEqual({
      rootNavigator: "Explorer",
      screenParams: {
        screen: "ContentScreen",
        params: {
          contentId: "5e7c68341eaf4d0051da1126",
        },
      },
    });
  });

  it("should parse qui sommes-nous url", () => {
    const res1 = getScreenFromUrl("https://refugies.info/en/who-are-we");
    expect(res1).toEqual({
      rootNavigator: "Profil",
      screenParams: {
        screen: "AboutScreen",
      },
    });

    const res2 = getScreenFromUrl("https://refugies.info/fr/qui-sommes-nous");
    expect(res2).toEqual({
      rootNavigator: "Profil",
      screenParams: {
        screen: "AboutScreen",
      },
    });

    const res3 = getScreenFromUrl("https://refugies.info/qui-sommes-nous");
    expect(res3).toEqual({
      rootNavigator: "Profil",
      screenParams: {
        screen: "AboutScreen",
      },
    });
  });
});
