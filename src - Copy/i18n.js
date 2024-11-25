// src/i18n.js

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Импортируйте файлы переводов
import translationRu from './locales/ru/translation.json';
import translationLv from './locales/lv/translation.json';

const resources = {
  ru: {
    translation: translationRu
  },
  lv: {
    translation: translationLv
  }
};

i18n
  .use(LanguageDetector) // Определение языка пользователя
  .use(initReactI18next) // Передача экземпляра i18n в react-i18next
  .init({
    resources,
    fallbackLng: 'ru', // Язык по умолчанию
    interpolation: {
      escapeValue: false // React уже защищает от XSS
    }
  });

export default i18n;
