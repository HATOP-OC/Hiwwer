import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enTranslations from './locales/en.json';
import ukTranslations from './locales/uk.json';
import plTranslations from './locales/pl.json';
import ruTranslations from './locales/ru.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: enTranslations
      },
      uk: {
        translation: ukTranslations
      },
      pl: {
        translation: plTranslations
      },
      ru: {
        translation: ruTranslations
      }
    }
  });

export default i18n;