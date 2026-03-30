import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    fallbackLng: 'ru-RU',

    backend: {
      // Здесь мы говорим: "Иди в папку фичи и бери файл языка"
      loadPath: '/locales/{{ns}}/{{lng}}.json',
    },

    // Обязательно укажите пространства имен (папки), которые есть в проекте
    ns: ['common', 'buttons'],
    defaultNS: 'common',

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
