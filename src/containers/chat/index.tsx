import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@shopify/restyle';
import FastImage from 'react-native-fast-image';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';

// Files
import {getScreenHeight} from '../../utils/commonServices';
import {ColorTheme, Theme} from '../../theme';
import {Box, CustomHeader, Text} from '../../components';
import images from '../../constants/images';
import {goBack, navigate} from '../../utils/routerServices';
import {Images, Routes} from '../../constants';
import {AppDispatch, RootState} from '../../redux/store';
import fonts from '../../constants/fonts';
import {
  fetchMessagesThunk,
  sendMessageThunk,
  setChatMessages,
} from '../../redux/chat';
import Message from '../../components/chat/Message';
import {socketRef} from '../../routers/HomeStack';

const Chat = () => {
  const theme = useTheme<Theme>();
  const {colors} = theme;
  const {t} = useTranslation();
  const dispatch: AppDispatch = useDispatch();
  const cancelToken = useRef<any>();
  const timeoutRef = useRef<NodeJS.Timeout>();

  const chatInfo = useSelector((state: RootState) => state.chat.chatInfo);
  const chatMessages = useSelector(
    (state: RootState) => state.chat.chatMessages,
  );
  const userData = useSelector((state: RootState) => state.auth.userData);

  const [message, setMessage] = useState('');
  const [typing, setTyping] = useState(false);

  const headerName = useMemo(() => {
    if (chatInfo?.isGroupChat) {
      return chatInfo?.chatName;
    }
    if (userData?.id === chatInfo?.users[0]._id) {
      return chatInfo?.users[1].name;
    }
    return chatInfo?.users[0].name;
  }, [
    chatInfo?.chatName,
    chatInfo?.isGroupChat,
    chatInfo?.users,
    userData?.id,
  ]);

  const styles = useMemo(() => createStyles(colors), [colors]);

  useEffect(() => {
    const {cancel, token} = axios.CancelToken.source();
    cancelToken.current = cancel;
    dispatch(fetchMessagesThunk({chatId: chatInfo?._id, cancelToken: token}));
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(colors.mainBackground);
      StatusBar.setBarStyle('dark-content');
    }

    return () => {
      dispatch(setChatMessages([]));
      if (cancelToken?.current) {
        cancelToken?.current('Cancelled');
      }
    };
  }, [chatInfo?._id, colors.mainBackground, dispatch]);

  useEffect(() => {
    socketRef?.current?.on('typing', () => {
      setTyping(true);
    });

    socketRef?.current?.on('stoptyping', () => {
      setTyping(false);
    });

    return () => {
      // Clear old listeners before setting up new ones
      socketRef?.current?.off('typing');
      socketRef?.current?.off('stoptyping');
      socketRef?.current?.emit('leave chat', chatInfo?._id);
    };
  }, [chatInfo?._id]);

  const onPressSend = () => {
    socketRef?.current?.emit('stoptyping', chatInfo?._id);

    if (message) {
      dispatch(sendMessageThunk({content: message, chatId: chatInfo?._id}));
      setMessage('');
    }
  };

  const changeHandler = (text: string) => {
    setMessage(text);
    if (text) {
      socketRef.current?.emit('typing', chatInfo?._id);

      if (timeoutRef?.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        socketRef?.current?.emit('stoptyping', chatInfo?._id);
      }, 1000);
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <CustomHeader
        rightAction={() => navigate(Routes.GROUP_INFO, {})}
        rightIcon={chatInfo?.isGroupChat ? images.info : null}
        title={headerName}
        leftAction={goBack}
        leftIcon={Images.back}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjust behavior as needed
        style={{flex: 1}}>
        <Box margin="s" flex={1} backgroundColor="mainBackground">
          <FlatList
            inverted
            data={chatMessages}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({item}) => <Message item={item} />}
          />
          {typing ? <Text>Typing...</Text> : null}
          <Box margin={'l'} flexDirection={'row'} alignItems={'center'}>
            <Box maxHeight={getScreenHeight(10)} marginRight={'m'} flex={1}>
              <TextInput
                style={styles.textInput}
                placeholder={t('appNamespace.typeMessage')}
                onChangeText={changeHandler}
                value={message}
                numberOfLines={4}
                multiline={true}
              />
            </Box>
            <TouchableOpacity onPress={onPressSend}>
              <FastImage source={Images.send} style={styles.icon} />
            </TouchableOpacity>
          </Box>
        </Box>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const createStyles = (theme: ColorTheme) => {
  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: theme.mainBackground,
    },
    icon: {
      height: getScreenHeight(2.5),
      width: getScreenHeight(2.5),
    },
    textInput: {
      color: theme.mainForeground,
      fontFamily: fonts.medium,
      borderColor: theme.borderColor,
      borderWidth: 1,
      borderRadius: getScreenHeight(2),
      padding: getScreenHeight(1),
      textAlign: 'left',
    },
  });
};

export default Chat;
