import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

// Files
import en from './en.json';
import zh from './zh.json';
import ar from './ar.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import keys from '../constants/keys';

const resources = {
  en: {
    translation: en,
  },
  zh: {
    translation: zh,
  },
  ar: {
    translation: ar,
  },
};

AsyncStorage.getItem(keys.LOCALE_PERSISTENCE_KEY).then(selectedLanguage => {
  i18n.use(initReactI18next).init({
    resources,
    lng: selectedLanguage || 'en', // Set the initial language from AsyncStorage, defaulting to 'en'
    fallbackLng: 'en',
    compatibilityJSON: 'v3',
    interpolation: {
      escapeValue: false,
    },
  });
});

export default i18n;
