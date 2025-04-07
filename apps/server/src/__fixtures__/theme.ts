import { ObjectId, Theme } from "~/typegoose";

export const themeFixture = new Theme();

themeFixture._id = new ObjectId("63286a015d31b2c0cad9960e");
themeFixture.name = {
  fr: "trouver un travail",
  en: "find a job",
  ar: "ايجاد عمل",
  fa: "پیدا کردن شغل",
  ps: "دنده ومومئ",
  ru: "найти работу",
  uk: "Працевлаштування",
  ti: "ሓደ ስራሕ ምርካብ",
};
themeFixture.short = {
  fr: "Insertion pro",
  en: "Job hunting",
  ar: "الاندماج المهني",
  fa: "درج حرفه ای",
  ps: "مسلکي مرسته",
  ru: "Работа",
  uk: "Працевлаштування",
  ti: "ምትእትታው ሞያ ብውሕልልነት",
};
themeFixture.mainColor = "#FFFFFF";
themeFixture.colors = {
  color100: "#055E5A",
  color80: "#27A8A5",
  color60: "#82F2DB",
  color40: "#D7FAF2",
  color30: "#EDFDF9",
};
themeFixture.position = 6;
themeFixture.icon = {
  secure_url: "/images/icon_briefcase.svg",
  public_id: "",
  imgId: "",
};
themeFixture.banner = {
  secure_url: "/images/illustration_Insertion-pro.svg",
  public_id: "",
  imgId: "",
};
themeFixture.appBanner = {
  secure_url: "/images/app-banner/travail.png",
  public_id: "",
  imgId: "",
};
themeFixture.appImage = {
  secure_url: "/images/app/travail.svg",
  public_id: "",
  imgId: "",
};
themeFixture.shareImage = {
  secure_url: "/images/share/ri-insertion.png",
  public_id: "",
  imgId: "",
};
themeFixture.dispositifImage = {
  secure_url: "/images/cards/dispositif/travail.svg",
  public_id: "",
  imgId: "",
};
themeFixture.demarcheImage = {
  secure_url: "/images/cards/demarche/travail.svg",
  public_id: "",
  imgId: "",
};
themeFixture.notificationEmoji = "💼";
