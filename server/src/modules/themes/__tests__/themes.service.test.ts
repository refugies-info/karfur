// @ts-nocheck
import { isThemeActive } from "../themes.service";

const theme = {
  name: {
    fr: "fr",
    en: "en",
    ar: "ar",
  },
  short: {
    fr: "fr",
    en: "en",
    ar: "ar",
  },
  colors: {
    color100: "#000",
    color80: "#000",
    color60: "#000",
    color40: "#000",
    color30: "#000",
  },
  icon: {secure_url: "img"},
  banner: {secure_url: "img"},
  appImage: {secure_url: "img"},
  shareImage: { secure_url: "img" },
  notificationEmoji:"⚠️"
};
const activeLanguages = [
  { i18nCode: "fr" },
  { i18nCode: "en" },
  { i18nCode: "ar" },
];

describe("isThemeActive", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should return not active when not complete", async () => {
    const theme1 = JSON.parse(JSON.stringify(theme));
    delete theme1.name.fr;
    const res1 = isThemeActive(theme1, activeLanguages);
    expect(res1).toEqual(false);

    const theme2 = JSON.parse(JSON.stringify(theme));
    delete theme2.colors.color40;
    const res2 = isThemeActive(theme2, activeLanguages);
    expect(res2).toEqual(false);

    const theme3 = JSON.parse(JSON.stringify(theme));
    theme3.icon.secure_url = "";
    const res3 = isThemeActive(theme3, activeLanguages);
    expect(res3).toEqual(false);
  });

  it("should return active when complete", async () => {
    const res = isThemeActive(theme, activeLanguages);
    expect(res).toEqual(true);
  });
});
