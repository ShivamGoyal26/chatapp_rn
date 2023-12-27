import React, {useCallback, useRef, useState} from 'react';
import {ActivityIndicator, FlatList} from 'react-native';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@shopify/restyle';

// Files
import {getScreenHeight} from '../../utils/commonServices';
import {AppDispatch} from '../../redux/store';
import {Theme} from '../../theme';
import {Box, Text, UserItem, UserSearch} from '../../components';
import {findUsersThunk} from '../../redux/auth';
import {SearchUsersRequestData, SearchedUser} from '../../types/common';

const PER_POST_LIMIT = 10;

const RenderSeparator = () => {
  return (
    <Box borderColor="borderColor" borderBottomWidth={getScreenHeight(0.1)} />
  );
};

const LoadUsers = ({action}: {action?: () => void}) => {
  const theme = useTheme<Theme>();
  const {colors} = theme;
  const {t} = useTranslation();
  const dispatch: AppDispatch = useDispatch();
  const totalPagesRef = useRef<number>(1);
  const currentPageRef = useRef<number>(1);
  const userInputRef = useRef<string>('');

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<SearchedUser[]>([]);

  const findUsers = useCallback(
    async (searchedQuery: string) => {
      setLoading(true);
      let data: SearchUsersRequestData = {
        search: searchedQuery,
        limit: PER_POST_LIMIT,
        page: currentPageRef.current,
      };

      const res: any = await dispatch(findUsersThunk(data));
      if (res.meta.requestStatus === 'fulfilled') {
        setUsers(pre => pre.concat(res.payload.data));
        totalPagesRef.current = res.payload.pages;
        setLoading(false);
      }
    },
    [dispatch],
  );

  const keywordHandler = useCallback(
    (userInput: string) => {
      if (userInput) {
        userInputRef.current = userInput;
        setUsers([]);
        currentPageRef.current = 1;
        totalPagesRef.current = 1;
        findUsers(userInput);
      } else {
        setUsers([]);
        userInputRef.current = '';
        currentPageRef.current = 1;
        totalPagesRef.current = 1;
      }
    },
    [findUsers],
  );

  const onEndReached = useCallback(() => {
    if (
      userInputRef.current &&
      totalPagesRef.current > currentPageRef.current
    ) {
      currentPageRef.current = currentPageRef.current + 1;
      findUsers(userInputRef.current);
    }
  }, [findUsers]);

  const renderFotter = useCallback(() => {
    return users.length && totalPagesRef.current === currentPageRef.current ? (
      <Text textAlign="center" marginBottom="l" variant="subtitle">
        {t('appNamespace.endOfResults')}
      </Text>
    ) : loading ? (
      <ActivityIndicator
        style={{marginBottom: getScreenHeight(2)}}
        color={colors.borderColor}
      />
    ) : null;
  }, [colors.borderColor, loading, t, users.length]);

  const renderEmpty = useCallback(() => {
    return userInputRef.current && !loading ? (
      <Text textAlign="center" mt="m" variant="subtitle">
        {t('appNamespace.noResultsFound')}
      </Text>
    ) : null;
  }, [loading, t]);

  console.log('users', users);

  return (
    <Box flex={1} backgroundColor="mainBackground">
      <UserSearch action={keywordHandler} />
      <FlatList
        data={users}
        keyExtractor={user => `${user._id}`}
        renderItem={({item}: {item: SearchedUser}) => (
          <UserItem action={action} {...item} />
        )}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFotter}
        ListEmptyComponent={renderEmpty}
        ItemSeparatorComponent={RenderSeparator}
      />
    </Box>
  );
};

export default LoadUsers;
