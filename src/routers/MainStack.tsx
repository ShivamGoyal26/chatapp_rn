import React, {useCallback, useEffect, useRef} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import NetInfo from '@react-native-community/netinfo';
// Files
import {Routes} from '../constants';
import AuthStack from './AuthStack';
import {spinnerRef} from '../utils/spinnerRef';
import CustomLoadingModal from '../components/common/CustomModalLoading';
import HomeStack from './HomeStack';
import {AuthLoading} from '../containers';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../redux/store';
import {setIsInternet} from '../redux/common';
import {InternetConnection} from '../components';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  const internetRef = useRef<any>();
  const dispatch = useDispatch<AppDispatch>();

  const internetManager = useCallback(async () => {
    internetRef.current = NetInfo.addEventListener((state: any) => {
      const offline = !(state.isConnected && state.isInternetReachable);
      if (!offline) {
        dispatch(setIsInternet(true));
        // 'Internet Working'
      } else {
        dispatch(setIsInternet(false));
        // 'Internet Not Working'
      }
    });
  }, [dispatch]);

  useEffect(() => {
    internetManager();

    return () => {
      if (internetRef?.current) {
        internetRef.current();
      }
    };
  }, [internetManager]);

  return (
    <>
      <InternetConnection />
      <CustomLoadingModal ref={spinnerRef} />
      <Stack.Navigator
        initialRouteName={Routes.AUTH_LOADING}
        screenOptions={{headerShown: false}}>
        <Stack.Screen
          options={{
            animation: 'slide_from_bottom',
          }}
          name={Routes.AUTH_LOADING}
          component={AuthLoading}
        />
        <Stack.Screen
          options={{
            animation: 'slide_from_bottom',
          }}
          name={Routes.AUTH_STACK}
          component={AuthStack}
        />
        <Stack.Screen
          options={{
            animation: 'slide_from_bottom',
          }}
          name={Routes.HOME_STACK}
          component={HomeStack}
        />
      </Stack.Navigator>
    </>
  );
};

export default MainStack;
