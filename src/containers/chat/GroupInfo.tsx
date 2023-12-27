import React, {useCallback, useMemo} from 'react';
import {Alert, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@shopify/restyle';
import {produce} from 'immer';
import {useDispatch, useSelector} from 'react-redux';

// Files
import {getScreenHeight} from '../../utils/commonServices';
import {ColorTheme, Theme} from '../../theme';
import {Box, CustomHeader, Text} from '../../components';
import {goBack, navigate} from '../../utils/routerServices';
import {Images, Routes} from '../../constants';
import {UserDataFromServer} from '../../types/auth';
import Spinner from '../../utils/spinnerRef';
import {AppDispatch, RootState} from '../../redux/store';
import {
  deleteGroupThunk,
  removeUserFromGroupThunk,
  setChatInfo,
} from '../../redux/chat';

type RenderItemProps = UserDataFromServer & {
  onUserDeletePress: (userId: string) => void;
  isAdmin: boolean;
  isDeleteable: boolean;
};

const RenderItem = ({
  name,
  onUserDeletePress,
  _id,
  isAdmin,
  isDeleteable,
}: RenderItemProps) => {
  const {t} = useTranslation();
  return (
    <Box
      flex={1}
      flexDirection={'row'}
      marginBottom={'l'}
      alignItems={'center'}>
      <Box
        height={getScreenHeight(9)}
        width={getScreenHeight(9)}
        borderRadius={getScreenHeight(100)}
        borderColor={'borderColor'}
        borderWidth={getScreenHeight(0.1)}
        justifyContent={'center'}
        marginRight={'m'}
        alignItems={'center'}>
        <Text variant={'heading'}>{name[0]}</Text>
      </Box>
      <Box flex={1}>
        <Text numberOfLines={1} variant={'title'}>
          {name}
        </Text>
        {isAdmin && isDeleteable ? (
          <TouchableOpacity
            onPress={() =>
              Alert.alert('Are you sure?', `you are removing user ${name}`, [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {text: 'OK', onPress: () => onUserDeletePress(_id)},
              ])
            }
            style={{alignSelf: 'flex-start'}}>
            <Text variant={'error'}>{t('appNamespace.remove')}</Text>
          </TouchableOpacity>
        ) : null}
      </Box>
    </Box>
  );
};

const GroupInfo = () => {
  const chatInfo = useSelector((state: RootState) => state.chat.chatInfo);

  const theme = useTheme<Theme>();
  const {colors} = theme;
  const dispatch = useDispatch<AppDispatch>();
  const {t} = useTranslation();

  const styles = useMemo(() => createStyles(colors), [colors]);
  const userData = useSelector((state: RootState) => state.auth.userData);

  const data = useMemo(() => {
    if (chatInfo) {
      const idToRemove = userData?.id;
      const updateditemData = produce(chatInfo, draft => {
        draft.users = draft.users.filter(user => user._id !== idToRemove);
      });
      return updateditemData;
    }
  }, [chatInfo, userData?.id]);

  const isAdmin = useMemo(() => {
    const res = chatInfo?.groupAdmin.find(
      (item: UserDataFromServer) => item._id === userData?.id,
    );
    if (res) {
      return true;
    }
    return false;
  }, [chatInfo?.groupAdmin, userData?.id]);

  const isDeleteable = useMemo(() => {
    let userLength = data?.users.length;
    if (userLength === 1) {
      return false;
    }
    return true;
  }, [data?.users.length]);

  const onUserDeletePress = useCallback(
    async (userId: string) => {
      const mainData = {
        userId: userId,
        chatId: chatInfo?._id,
      };
      Spinner.show();
      const res: any = await dispatch(removeUserFromGroupThunk(mainData));
      Spinner.hide();
      if (res.meta.requestStatus === 'fulfilled') {
        dispatch(setChatInfo(res.payload.data));
      }
    },
    [chatInfo?._id, dispatch],
  );

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <CustomHeader
        leftIcon={Images.back}
        leftAction={goBack}
        rightAction={() => navigate(Routes.ADD_USERS_TO_GROUP, {})}
        rightIcon={Images.plus}
        title={chatInfo?.chatName}
      />

      <Box margin="s" flex={1} backgroundColor="mainBackground">
        <FlatList
          data={data?.users}
          keyExtractor={item => item._id}
          renderItem={({item}) => (
            <RenderItem
              isDeleteable={isDeleteable}
              {...item}
              isAdmin={isAdmin}
              onUserDeletePress={onUserDeletePress}
            />
          )}
        />
        {isAdmin ? (
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                'Are you sure?',
                `${chatInfo?.chatName} is going to be deleted`,
                [
                  {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {
                    text: 'OK',
                    onPress: () =>
                      dispatch(deleteGroupThunk({chatId: chatInfo?._id})),
                  },
                ],
              );
            }}
            style={{alignSelf: 'center'}}>
            <Text marginBottom={'m'} variant={'title'} color={'error'}>
              {t('appNamespace.deleteGroup')}
            </Text>
          </TouchableOpacity>
        ) : null}
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
  });
};

export default GroupInfo;
