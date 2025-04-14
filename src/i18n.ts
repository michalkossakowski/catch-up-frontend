import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";


i18n
  .use(HttpApi)
  .use(LanguageDetector) // Wykrywa język użytkownika
  .use(initReactI18next)
  .init({
    fallbackLng: {
      "en-US": ["en"],
      "en-GB": ["en"],
      "fr-CA": ["fr"],
      "fr-FR": ["fr"],
      default: ["en"],
    }, // Domyślny język
    detection: {
      order: ["localStorage", "navigator"], // Kolejność wykrywania języka
      caches: ["localStorage"], // Zapisuje wybór języka w localStorage
    },
    backend: {
      loadPath: "/locales/{{lng}}/translation.json" // Ścieżka do plików JSON
    },
    interpolation: {
      escapeValue: false,
    }, 
  });

export const availableLanguages: { [key: string]: string } = {
    'en': "English",
    'pl': "Polski",
    'fr': "Français",
    'de': "Deutsch",
    'es': "Español",
};

export const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    if (!availableLanguages.hasOwnProperty(lng)) {
        i18n.changeLanguage("en");
        return "en";
    }
    localStorage.setItem("i18nextLng", lng);
};

export const normalizeLanguage = (lng: string) => {
    if (!lng) return "en";
    if (!availableLanguages.hasOwnProperty(lng)) {
        i18n.changeLanguage("en");
        return "en";
    }
    return lng.split("-")[0];
};

export default i18n;
