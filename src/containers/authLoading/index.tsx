import React, {useCallback, useEffect} from 'react';

// Files
import {resetRoot} from '../../utils/routerServices';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Routes} from '../../constants';
import {RootState} from '../../redux/store';
import {FullScreenLoader} from '../../components';

const AuthLoading = () => {
  const userData = useSelector((state: RootState) => state.auth.userData);
  const authToken = useSelector((state: RootState) => state.auth.authToken);

  const checkUserStatus = useCallback(async () => {
    await AsyncStorage.getItem('persist:root');
    if (authToken && userData) {
      resetRoot(Routes.HOME_STACK);
    } else {
      resetRoot(Routes.AUTH_STACK);
    }
  }, [authToken, userData]);

  useEffect(() => {
    checkUserStatus();
  }, [checkUserStatus, authToken, userData]);

  return <FullScreenLoader />;
};

export default AuthLoading;
