export const useRTL = (locale: string): boolean => {
  const rtlLanguages = ["ar", "ps", "fa"];
  return rtlLanguages.includes(locale);
};
