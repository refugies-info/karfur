export const getFormattedLocale = (locale: string) => {
  if (locale === "en") return "anglais";
  if (locale === "ar") return "arabe";
  if (locale === "ru") return "russe";
  if (locale === "ti-ER") return "tigrinya";
  if (locale === "ps") return "pachto";
  if (locale === "fa") return "persan";
  return "locale not found";
};
