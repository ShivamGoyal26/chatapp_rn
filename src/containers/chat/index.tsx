import React, {useEffect, useMemo, useState} from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@shopify/restyle';
import FastImage from 'react-native-fast-image';

// Files
import {getScreenHeight} from '../../utils/commonServices';
import {ColorTheme, Theme} from '../../theme';
import {Box, CustomHeader} from '../../components';
import images from '../../constants/images';
import {goBack, navigate} from '../../utils/routerServices';
import {Images, Routes} from '../../constants';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {ChatItem} from '../../types/chat';
import fonts from '../../constants/fonts';

const Chat = ({route}: any) => {
  const data: ChatItem = route.params.data;
  const theme = useTheme<Theme>();
  const {colors} = theme;
  const {t} = useTranslation();

  const userData = useSelector((state: RootState) => state.auth.userData);
  const [message, setMessage] = useState('');

  const headerName = useMemo(() => {
    if (data.isGroupChat) {
      return data.chatName;
    }
    if (userData?.id === data.users[0]._id) {
      return data.users[1].name;
    }
    return data.users[0].name;
  }, [data.chatName, data.isGroupChat, data.users, userData?.id]);

  const styles = useMemo(() => createStyles(colors), [colors]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(colors.mainBackground);
      StatusBar.setBarStyle('dark-content');
    }
  }, [colors?.mainBackground]);

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <CustomHeader
        rightAction={() => navigate(Routes.GROUP_INFO, {data: data})}
        rightIcon={data.isGroupChat ? images.info : null}
        title={headerName}
        leftAction={goBack}
        leftIcon={Images.back}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjust behavior as needed
        style={{flex: 1}}>
        <Box margin="s" flex={1} backgroundColor="mainBackground">
          <FlatList
            data={[]}
            keyExtractor={(_, index) => index.toString()}
            renderItem={() => <View />}
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
            <TouchableOpacity>
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
