import isInBrowser from "lib/isInBrowser";

const LOCALE_KEY = "languei18nCode";

const getFromCache = () => {
  return localStorage.getItem(LOCALE_KEY);
}

const saveInCache = (ln: string) => {
  if (isInBrowser() && ln !== "default") {
    localStorage.setItem(LOCALE_KEY, ln);
  }
}

const locale = {
  getFromCache,
  saveInCache
}

export default locale;
