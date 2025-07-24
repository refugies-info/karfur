export function useTranslation() {
  return {
    t: (str) => str,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  };
}
