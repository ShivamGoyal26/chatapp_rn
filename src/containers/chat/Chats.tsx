import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
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
import {getUserChatsThunk, setChatInfo} from '../../redux/chat';
import {ChatItem as ChatItemProps} from '../../types/chat';
import images from '../../constants/images';
import {navigate} from '../../utils/routerServices';
import {Routes} from '../../constants';

const PER_CHAT_LIMIT = 10;

const RenderSeparator = () => {
  return (
    <Box borderColor="borderColor" borderBottomWidth={getScreenHeight(0.1)} />
  );
};

const Chats = () => {
  const theme = useTheme<Theme>();
  const {colors} = theme;
  const {t} = useTranslation();
  const dispatch: AppDispatch = useDispatch();
  const isInternet = useSelector((state: RootState) => state.common.isInternet);
  const userData = useSelector((state: RootState) => state.auth.userData);
  const [chats, setChats] = useState([]);
  const totalPagesRef = useRef<number>(1);
  const currentPageRef = useRef<number>(1);
  const apiHitRateRef = useRef();

  const styles = useMemo(() => createStyles(colors), [colors]);

  const [loading, setLoading] = useState(false);

  const getUserChats = useCallback(async () => {
    setLoading(true);
    let userChatParams = {
      limit: PER_CHAT_LIMIT,
      page: currentPageRef.current,
    };
    let res: any = await dispatch(getUserChatsThunk(userChatParams));
    setLoading(false);
    if (res.meta.requestStatus === 'fulfilled') {
      setChats(pre => pre.concat(res.payload.data));
      totalPagesRef.current = res.payload.pages;
    }
  }, [dispatch]);

  useFocusEffect(
    React.useCallback(() => {
      if (isInternet) {
        setChats([]);
        currentPageRef.current = 1;
        totalPagesRef.current = 1;
        getUserChats();
      }

      return () => {
        if (apiHitRateRef?.current) {
          clearTimeout(apiHitRateRef?.current);
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isInternet]),
  );

  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(colors.mainBackground);
      StatusBar.setBarStyle('dark-content');
    }
  }, [colors?.mainBackground]);

  const onEndReached = useCallback(() => {
    if (totalPagesRef.current > currentPageRef.current) {
      currentPageRef.current = currentPageRef.current + 1;
      getUserChats();
    }
  }, [getUserChats]);

  const renderFotter = useCallback(() => {
    return chats.length && totalPagesRef.current === currentPageRef.current ? (
      <Text textAlign="center" marginBottom="l" variant="subtitle">
        {t('appNamespace.endOfResults')}
      </Text>
    ) : loading ? (
      <ActivityIndicator
        style={{marginBottom: getScreenHeight(2)}}
        color={colors.borderColor}
      />
    ) : null;
  }, [chats.length, colors.borderColor, loading, t]);

  const renderEmpty = useCallback(() => {
    return !loading ? (
      <Text textAlign="center" mt="m" variant="subtitle">
        {t('appNamespace.noResultsFound')}
      </Text>
    ) : null;
  }, [loading, t]);

  const onChatItemClick = useCallback(
    (data: ChatItemProps) => {
      dispatch(setChatInfo(data));
      navigate(Routes.CHAT_STACK, {});
    },
    [dispatch],
  );

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <Text>This is test</Text>
      <CustomHeader
        rightAction={() => navigate(Routes.CREATE_GROUP, {})}
        rightIcon={images.plus}
        title={t('appNamespace.chats')}
      />

      <Box
        // justifyContent={{phone: 'center', tablet: 'space-around'}}
        margin="s"
        flex={1}
        backgroundColor="mainBackground">
        <FlatList
          data={chats}
          keyExtractor={chat => `${chat._id}`}
          renderItem={({item}: {item: ChatItemProps}) => (
            <TouchableOpacity onPress={() => onChatItemClick(item)}>
              <ChatItem {...item} userId={userData?.id} />
            </TouchableOpacity>
          )}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFotter}
          ListEmptyComponent={renderEmpty}
          ItemSeparatorComponent={RenderSeparator}
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
