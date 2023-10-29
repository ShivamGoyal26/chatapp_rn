import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Files
import {Routes} from '../constants';
import AuthStack from './AuthStack';
import {spinnerRef} from '../utils/spinnerRef';
import CustomLoadingModal from '../components/common/CustomModalLoading';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <>
      <CustomLoadingModal ref={spinnerRef} />
      <Stack.Navigator
        initialRouteName={Routes.AUTH_STACK}
        screenOptions={{headerShown: false}}>
        <Stack.Screen
          options={{
            animation: 'slide_from_bottom',
          }}
          name={Routes.AUTH_STACK}
          component={AuthStack}
        />
      </Stack.Navigator>
    </>
  );
};

export default MainStack;
