import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Files
import {Routes} from '../constants';
import BottomBar from './BottomBar';
import CreateGroup from '../containers/chat/CreateGroup';

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={Routes.BOTTOM_BAR}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name={Routes.BOTTOM_BAR} component={BottomBar} />
      <Stack.Screen name={Routes.CREATE_GROUP} component={CreateGroup} />
    </Stack.Navigator>
  );
};

export default HomeStack;
