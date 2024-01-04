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
import {io} from 'socket.io-client';

// Files
import {getScreenHeight} from '../../utils/commonServices';
import {ColorTheme, Theme} from '../../theme';
import {Box, CustomHeader} from '../../components';
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

const ENDPOINT = 'http://192.168.29.88:3000';
let socket, selectedChatCompare;

const Chat = () => {
  const theme = useTheme<Theme>();
  const {colors} = theme;
  const {t} = useTranslation();
  const dispatch: AppDispatch = useDispatch();
  const cancelToken = useRef<any>();

  const chatInfo = useSelector((state: RootState) => state.chat.chatInfo);
  const chatMessages = useSelector(
    (state: RootState) => state.chat.chatMessages,
  );
  const userData = useSelector((state: RootState) => state.auth.userData);

  const [message, setMessage] = useState('');

  useEffect(() => {
    socket = io(ENDPOINT);
  }, []);

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

  const onPressSend = () => {
    if (message) {
      dispatch(sendMessageThunk({content: message, chatId: chatInfo?._id}));
      setMessage('');
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
          <Box margin={'l'} flexDirection={'row'} alignItems={'center'}>
            <Box maxHeight={getScreenHeight(10)} marginRight={'m'} flex={1}>
              <TextInput
                style={styles.textInput}
                placeholder={t('appNamespace.typeMessage')}
                onChangeText={setMessage}
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
