import translationFR from './fr/translation.json';
import translationEN from './en/translation.json';
import translationAR from './ar/translation.json';

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
  },
  ps: {
    translation: {},
    name : 'pashto',
    RTL : true,
    code: 'ps',
  }
};