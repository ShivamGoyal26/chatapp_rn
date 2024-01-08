import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useDispatch, useSelector} from 'react-redux';
import {Socket, io} from 'socket.io-client';

// Files
import {Routes} from '../constants';
import BottomBar from './BottomBar';
import {CreateGroup} from '../containers';
import ChatStack from './ChatStack';
import api from '../constants/api';
import {AppDispatch, RootState} from '../redux/store';
import {messageFromSocketThunk} from '../redux/chat';

const Stack = createNativeStackNavigator();
export const socketRef: React.RefObject<Socket> = React.createRef();

const HomeStack = () => {
  const userData = useSelector((state: RootState) => state.auth.userData);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    if (userData) {
      socketRef.current?.off('setup');
      socketRef.current?.off('message received');
      socketRef.current = io(api.sockets.ENDPOINT);
      socketRef.current.emit('setup', userData);
      socketRef.current.on('connected', () => {
        console.log('Socket connected ');
      });
      socketRef?.current?.on('message received', newMessageRecieved => {
        dispatch(messageFromSocketThunk(newMessageRecieved));
      });
    } else {
      socketRef.current?.off('setup');
      socketRef.current?.off('message received');
    }

    return () => {
      socketRef.current?.emit('reset');
      socketRef.current?.disconnect();
    };
  }, [dispatch, userData]);

  return (
    <Stack.Navigator
      initialRouteName={Routes.BOTTOM_BAR}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name={Routes.BOTTOM_BAR} component={BottomBar} />
      <Stack.Screen name={Routes.CREATE_GROUP} component={CreateGroup} />
      <Stack.Screen name={Routes.CHAT_STACK} component={ChatStack} />
    </Stack.Navigator>
  );
};

export default HomeStack;
