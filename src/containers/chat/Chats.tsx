import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {FlatList, Platform, StatusBar, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@shopify/restyle';
import {useFocusEffect} from '@react-navigation/native';

// Files
import {getScreenHeight} from '../../utils/commonServices';
import {ColorTheme, Theme} from '../../theme';
import {Box, ChatItem, CustomHeader, Text} from '../../components';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import {getUserChatsThunk} from '../../redux/chat';
import {ChatItem as ChatItemProps} from '../../types/chat';

const PER_CHAT_LIMIT = 10;

const Chats = () => {
  const theme = useTheme<Theme>();
  const {colors} = theme;
  const {t} = useTranslation();
  const dispatch: AppDispatch = useDispatch();
  const isInternet = useSelector((state: RootState) => state.common.isInternet);
  const [chats, setChats] = useState([]);

  const styles = useMemo(() => createStyles(colors), [colors]);

  const getUserChats = useCallback(async () => {
    setChats([]);
    let res = await dispatch(getUserChatsThunk());
    if (res.meta.requestStatus === 'fulfilled') {
      setChats(pre => pre.concat(res.payload.data));
    }
  }, [dispatch]);

  useFocusEffect(
    React.useCallback(() => {
      if (isInternet) {
        getUserChats();
      }
    }, [getUserChats, isInternet]),
  );

  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(colors.mainBackground);
      StatusBar.setBarStyle('dark-content');
    }
  }, [colors?.mainBackground]);

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <CustomHeader title={t('appNamespace.chats')} />

      <Box
        // justifyContent={{phone: 'center', tablet: 'space-around'}}
        margin="s"
        flex={1}
        backgroundColor="mainBackground">
        <FlatList
          data={chats}
          keyExtractor={chat => `${chat._id}`}
          renderItem={({item}: {item: ChatItemProps}) => <ChatItem {...item} />}
          // onEndReached={onEndReached}
          // onEndReachedThreshold={0.1}
          // ListFooterComponent={renderFotter}
          // ListEmptyComponent={renderEmpty}
          // ItemSeparatorComponent={RenderSeparator}
        />
      </Box>
    </SafeAreaView>
  );
};

const createStyles = (theme: ColorTheme) => {
  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: theme.mainBackground,
    },
    title: {
      color: theme.mainBackground,
      fontSize: getScreenHeight(2),
    },
    account: {
      alignSelf: 'center',
    },
  });
};

export default Chats;
