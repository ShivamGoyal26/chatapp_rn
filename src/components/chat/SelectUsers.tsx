import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@shopify/restyle';
import {produce} from 'immer';

// Files
import {getScreenHeight} from '../../utils/commonServices';
import {AppDispatch} from '../../redux/store';
import {Theme} from '../../theme';
import {Box, SelectUserItem, Text, UserSearch} from '../../components';
import {findUsersThunk} from '../../redux/auth';
import {SearchUsersRequestData} from '../../types/common';
import {SelectUserData, UserDataFromServer} from '../../types/auth';
import FastImage from 'react-native-fast-image';
import {Images} from '../../constants';

const PER_POST_LIMIT = 10;

const RenderSeparator = () => {
  return (
    <Box borderColor="borderColor" borderBottomWidth={getScreenHeight(0.1)} />
  );
};

type selectedUsersData = {
  [key: string]: SelectUserData;
};

type DisabledUsersData = {
  [key: string]: UserDataFromServer;
};

const SelectUsers = forwardRef((_, ref) => {
  const theme = useTheme<Theme>();
  const {colors} = theme;
  const {t} = useTranslation();
  const dispatch: AppDispatch = useDispatch();
  const totalPagesRef = useRef<number>(1);
  const currentPageRef = useRef<number>(1);
  const userInputRef = useRef<string>('');

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<SelectUserData[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<selectedUsersData>({});
  const [disabledUsers, setDisabledUsers] = useState<DisabledUsersData>({});

  useImperativeHandle(ref, () => ({
    getSelectedItem() {
      return users.filter(item => item.isSelected);
    },
    setDisableItems(items: UserDataFromServer[]) {
      let disableUsersObject: DisabledUsersData = {};
      items.forEach((user: UserDataFromServer) => {
        disableUsersObject[user._id] = user;
      });
      setDisabledUsers(disableUsersObject);
    },
  }));

  const actionHandler = useCallback((index: number) => {
    setUsers(pre => {
      let final = produce(pre, draft => {
        draft[index].isSelected = !draft[index].isSelected;
      });

      let selectedUser = final[index];

      setSelectedUsers(previousSelectedUsers => {
        let finalSelectedUsers: any = {...previousSelectedUsers};
        if (selectedUser.isSelected) {
          finalSelectedUsers[selectedUser._id] = selectedUser;
        } else {
          if (finalSelectedUsers[selectedUser._id]) {
            delete finalSelectedUsers[selectedUser._id];
          }
        }

        return finalSelectedUsers;
      });

      return final;
    });
  }, []);

  const removeUser = (id: string) => {
    const index = users.findIndex((item: SelectUserData) => item._id === id);
    if (index === -1) {
      setSelectedUsers(previousSelectedUsers => {
        let finalSelectedUsers: any = {...previousSelectedUsers};

        if (finalSelectedUsers[id]) {
          delete finalSelectedUsers[id];
        }

        return finalSelectedUsers;
      });
    } else {
      actionHandler(index);
    }
  };

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
        let mainData = res.payload.data?.map((item: SelectUserData) => {
          item.isSelected = !!selectedUsers[item._id];
          item.isDisabled = !!disabledUsers[item._id];
          return item;
        });

        setUsers(pre => pre.concat(mainData));
        totalPagesRef.current = res.payload.pages;
        setLoading(false);
      }
    },
    [dispatch, selectedUsers, disabledUsers],
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

  return (
    <Box flex={1} backgroundColor="mainBackground">
      <UserSearch action={keywordHandler} />
      {Object.values(selectedUsers).length ? (
        <Box marginBottom={'l'}>
          <ScrollView showsHorizontalScrollIndicator={false} horizontal>
            {Object.values(selectedUsers)?.map(
              (selectedUser: SelectUserData) => {
                return (
                  <Box
                    borderRadius={getScreenHeight(100)}
                    borderColor={'borderColor'}
                    width={getScreenHeight(8)}
                    height={getScreenHeight(8)}
                    borderWidth={getScreenHeight(0.1)}
                    justifyContent={'center'}
                    alignItems={'center'}
                    marginRight={'l'}
                    key={selectedUser._id}>
                    <TouchableOpacity
                      onPress={() => removeUser(selectedUser._id)}
                      style={styles.iconContainer}>
                      <FastImage
                        source={Images.remove}
                        resizeMode="contain"
                        style={styles.icon}
                      />
                    </TouchableOpacity>
                    <Text variant={'heading'}>{selectedUser.name[0]}</Text>
                  </Box>
                );
              },
            )}
          </ScrollView>
        </Box>
      ) : null}
      <FlatList
        data={users}
        keyExtractor={user => `${user._id}`}
        renderItem={({item, index}: {item: SelectUserData; index: number}) => (
          <SelectUserItem index={index} onPress={actionHandler} {...item} />
        )}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFotter}
        ListEmptyComponent={renderEmpty}
        ItemSeparatorComponent={RenderSeparator}
      />
    </Box>
  );
});

const styles = StyleSheet.create({
  icon: {
    height: getScreenHeight(2.5),
    width: getScreenHeight(2.5),
  },
  iconContainer: {
    position: 'absolute',
    zIndex: 10,
    top: 0,
    right: 0,
  },
});

export default SelectUsers;
