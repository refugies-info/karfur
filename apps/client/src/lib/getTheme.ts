import { GetThemeResponse, Id } from "@refugies-info/api-types";

const defaultTheme: GetThemeResponse = {
  _id: "default",
  name: {
    fr: "Thème",
    en: "",
    ar: "",
    fa: "",
    ps: "",
    ru: "",
    uk: "",
    ti: "",
  },
  short: {
    fr: "Thème",
    en: "",
    ar: "",
    fa: "",
    ps: "",
    ru: "",
    uk: "",
    ti: "",
  },
  mainColor: "#FFFFFF",
  colors: {
    color100: "#3A3A3A",
    color80: "#27A8A5",
    color60: "#82F2DB",
    color40: "#D7FAF2",
    color30: "#EEEEEE",
  },
  position: 4,
  icon: {
    secure_url: "/images/icon_default.svg",
    public_id: "",
    imgId: "",
  },
  banner: {
    secure_url: "/images/illustration_Insertion-pro.svg",
    public_id: "",
    imgId: "",
  },
  appBanner: {
    secure_url: "/images/app-banner/travail.png",
    public_id: "",
    imgId: "",
  },
  appImage: {
    secure_url: "/images/app/travail.svg",
    public_id: "",
    imgId: "",
  },
  shareImage: {
    secure_url: "/images/share/ri-insertion.png",
    public_id: "",
    imgId: "",
  },
  dispositifImage: {
    secure_url: "/images/cards/dispositif/travail.svg",
    public_id: "",
    imgId: "",
  },
  demarcheImage: {
    secure_url: "/images/cards/demarche/travail.svg",
    public_id: "",
    imgId: "",
  },
  notificationEmoji: "",
  adminComments: "",
  active: true,
};

export const getTheme = (id: Id | undefined, allThemes: GetThemeResponse[]) => {
  if (!id) return defaultTheme;
  return allThemes.find((theme) => theme._id === id) || defaultTheme;
};
