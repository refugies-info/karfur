import { GetThemeResponse } from "api-types";
import { ObjectId } from "mongodb";

const defaultTheme: GetThemeResponse = {
  _id: "id",
  name: {
    fr: "",
    en: "",
    ar: "",
    fa: "",
    ps: "",
    ru: "",
    uk: "",
    ti: ""
  },
  short: {
    fr: "",
    en: "",
    ar: "",
    fa: "",
    ps: "",
    ru: "",
    uk: "",
    ti: ""
  },
  colors: {
    color100: "#055E5A",
    color80: "#27A8A5",
    color60: "#82F2DB",
    color40: "#D7FAF2",
    color30: "#EDFDF9"
  },
  position: 4,
  icon: {
    secure_url: "/images/icon_briefcase.svg",
    public_id: "",
    imgId: ""
  },
  banner: {
    secure_url: "/images/illustration_Insertion-pro.svg",
    public_id: "",
    imgId: ""
  },
  appBanner: {
    secure_url: "/images/app-banner/travail.png",
    public_id: "",
    imgId: ""
  },
  appImage: {
    secure_url: "/images/app/travail.svg",
    public_id: "",
    imgId: ""
  },
  shareImage: {
    secure_url: "/images/share/ri-insertion.png",
    public_id: "",
    imgId: ""
  },
  notificationEmoji: "",
  adminComments: "",
  active: true,
}

export const getTheme = (id: ObjectId, allThemes: GetThemeResponse[]) => {
  return allThemes.find(theme => theme._id === id) || defaultTheme;
}

export const getThemes = (ids: ObjectId[], allThemes: GetThemeResponse[]) => {
  return ids.map(id => allThemes.find(theme => theme._id === id) || defaultTheme);
}
