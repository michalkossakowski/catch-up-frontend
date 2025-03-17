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

export default i18n;
