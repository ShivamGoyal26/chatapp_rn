import {Alert} from 'react-native';
import {useTranslation} from 'react-i18next';

// Files
import {Keys} from '../constants';
import {useAsyncStorage} from '.';
import {useCallback} from 'react';

const useChangeLanguage = () => {
  const {t, i18n} = useTranslation();
  const {setValue} = useAsyncStorage(
    Keys.LOCALE_PERSISTENCE_LANG_KEY,
    'default',
  );

  const changeLanguage = useCallback(
    async (language: string) => {
      try {
        await i18n.changeLanguage(language); // Wait for the language change to complete
        setValue(language);
      } catch (error) {
        console.log('Error in the language', error);
        Alert.alert(t('messagesNamespace.languageError'));
      }
    },
    [i18n, setValue, t],
  );

  return {
    changeLanguage,
  };
};

export default useChangeLanguage;
