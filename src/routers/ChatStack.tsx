import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Files
import {Routes} from '../constants';
import {AddUserToGroup, Chat, GroupInfo} from '../containers';

const Stack = createNativeStackNavigator();

const ChatStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={Routes.CHAT}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name={Routes.CHAT} component={Chat} />
      <Stack.Screen name={Routes.GROUP_INFO} component={GroupInfo} />
      <Stack.Screen
        name={Routes.ADD_USER_TO_GROUP}
        component={AddUserToGroup}
      />
    </Stack.Navigator>
  );
};

export default ChatStack;
