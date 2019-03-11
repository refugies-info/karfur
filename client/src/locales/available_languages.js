import translationFR from './fr/translation';
import translationEN from './en/translation';
import translationAR from './ar/translation';

export const available_languages = {
  fr: {
    translation: translationFR,
    name : 'Français',
    RTL : false,
    code: 'fr',
  },
  en: {
    translation: translationEN,
    name : 'English',
    RTL : false,
    code: 'gb',
  },
  ar: {
    translation: translationAR,
    name : 'العَرَبِيَّة‎',
    RTL : true,
    code: 'ma',
  }
};