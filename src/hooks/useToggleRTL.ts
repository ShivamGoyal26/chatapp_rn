import RNRestart from 'react-native-restart';
import {I18nManager} from 'react-native';

// Files
import {useCallback, useMemo} from 'react';

const useToggleRTL = () => {
  const isRTL = useMemo(() => I18nManager.isRTL, []);

  const toggleRTL = useCallback(async () => {
    I18nManager.forceRTL(!isRTL);
    RNRestart.Restart();
  }, [isRTL]);

  return {
    toggleRTL,
    isRTL,
  };
};

export default useToggleRTL;
