import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Files
import {Routes} from '../constants';
import {Login} from '../containers';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={Routes.LOGIN}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name={Routes.LOGIN} component={Login} />
    </Stack.Navigator>
  );
};

export default MainStack;
