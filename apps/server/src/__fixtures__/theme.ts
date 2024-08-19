import { ObjectId, Theme } from "../typegoose";

const theme = new Theme();

theme._id = new ObjectId("63286a015d31b2c0cad9960e")
theme.name = {
  fr: "trouver un travail",
  en: "find a job",
  ar: "ايجاد عمل",
  fa: "پیدا کردن شغل",
  ps: "دنده ومومئ",
  ru: "найти работу",
  uk: "Працевлаштування",
  ti: "ሓደ ስራሕ ምርካብ"
};
theme.short = {
  fr: "Insertion pro",
  en: "Job hunting",
  ar: "الاندماج المهني",
  fa: "درج حرفه ای",
  ps: "مسلکي مرسته",
  ru: "Работа",
  uk: "Працевлаштування",
  ti: "ምትእትታው ሞያ ብውሕልልነት"
};
theme.colors = {
  color100: "#055E5A",
  color80: "#27A8A5",
  color60: "#82F2DB",
  color40: "#D7FAF2",
  color30: "#EDFDF9"
};
theme.position = 6;
theme.icon = {
  secure_url: "/images/icon_briefcase.svg",
  public_id: "",
  imgId: ""
};
theme.banner = {
  secure_url: "/images/illustration_Insertion-pro.svg",
  public_id: "",
  imgId: ""
};
theme.appBanner = {
  secure_url: "/images/app-banner/travail.png",
  public_id: "",
  imgId: ""
};
theme.appImage = {
  secure_url: "/images/app/travail.svg",
  public_id: "",
  imgId: ""
};
theme.shareImage = {
  secure_url: "/images/share/ri-insertion.png",
  public_id: "",
  imgId: ""
};
theme.notificationEmoji = "💼";

export { theme }
