import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LNG_EN from './locales/en.json';
import LNG_VI from './locales/vi.json';
import logoEn from '../assets/img/en.png';
import logoVi from '../assets/img/vi.png';

export const language: any = [
  { value: 'vi', label: 'Tiếng việt', img: logoVi },
  { value: 'en', label: 'English', img: logoEn },
];

export const locales = {
  en: 'English',
  vi: 'Tiếng Việt',
};

export const resources = {
  en: { lng: LNG_EN },
  vi: { lng: LNG_VI },
};
export const defaultNS = 'lng';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    ns: ['lng'],
    defaultNS,
    fallbackLng: 'vi',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
