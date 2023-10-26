import {Alert} from 'react-native';
import {useTranslation} from 'react-i18next';

// Files
import {Keys} from '../constants';
import {useAsyncStorage} from '../hooks';

const useChangeLanguage = (language: string) => {
  const {t, i18n} = useTranslation();
  const {setValue} = useAsyncStorage(Keys.LOCALE_PERSISTENCE_KEY, 'default');

  const changeLanguage = async () => {
    try {
      await i18n.changeLanguage(language); // Wait for the language change to complete
      setValue(language);
    } catch (error) {
      console.log('Error in the language', error);
      Alert.alert(t('messagesNamespace.languageError'));
    }
  };

  return {
    changeLanguage,
  };
};

export default useChangeLanguage;
