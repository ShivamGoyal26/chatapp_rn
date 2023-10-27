import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Files
import {Routes} from '../constants';
import {Login, SignUp} from '../containers';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={Routes.LOGIN}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name={Routes.LOGIN} component={Login} />
      <Stack.Screen
        options={{
          animation: 'slide_from_bottom',
        }}
        name={Routes.SIGNUP}
        component={SignUp}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
