import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Files
import {Routes} from '../constants';
import AuthStack from './AuthStack';
import {spinnerRef} from '../utils/spinnerRef';
import CustomLoadingModal from '../components/common/CustomModalLoading';
import HomeStack from './HomeStack';
import {AuthLoading} from '../containers';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <>
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
