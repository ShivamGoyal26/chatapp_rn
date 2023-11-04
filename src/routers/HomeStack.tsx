import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Files
import {Routes} from '../constants';
import BottomBar from './BottomBar';
import {Chat, CreateGroup} from '../containers';

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={Routes.BOTTOM_BAR}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name={Routes.BOTTOM_BAR} component={BottomBar} />
      <Stack.Screen name={Routes.CREATE_GROUP} component={CreateGroup} />
      <Stack.Screen name={Routes.CHAT} component={Chat} />
    </Stack.Navigator>
  );
};

export default HomeStack;
