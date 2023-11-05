import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@shopify/restyle';
import {produce} from 'immer';

// Files
import {getScreenHeight} from '../../utils/commonServices';
import {ColorTheme, Theme} from '../../theme';
import {Box, CustomHeader, Text} from '../../components';
import {ChatItem as ChatItemProps} from '../../types/chat';
import images from '../../constants/images';
import {navigate} from '../../utils/routerServices';
import {Routes} from '../../constants';
import {UserDataFromServer} from '../../types/auth';
import Spinner from '../../utils/spinnerRef';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import {removeUserFromGroupThunk} from '../../redux/chat';

type RenderItemProps = UserDataFromServer & {
  onUserDeletePress: (userId: string) => void;
  isAdmin: boolean;
};

const RenderItem = ({
  name,
  onUserDeletePress,
  _id,
  isAdmin,
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
        {isAdmin ? (
          <TouchableOpacity
            onPress={() => onUserDeletePress(_id)}
            style={{alignSelf: 'flex-start'}}>
            <Text variant={'error'}>{t('appNamespace.remove')}</Text>
          </TouchableOpacity>
        ) : null}
      </Box>
    </Box>
  );
};

const GroupInfo = ({route}: any) => {
  const itemData: ChatItemProps = route.params.data;

  const theme = useTheme<Theme>();
  const {colors} = theme;
  const dispatch = useDispatch<AppDispatch>();

  const styles = useMemo(() => createStyles(colors), [colors]);
  const userData = useSelector((state: RootState) => state.auth.userData);
  const [data, setData] = useState(itemData);

  const setGroupData = useCallback(
    (chatInfo: ChatItemProps) => {
      if (chatInfo) {
        const idToRemove = userData?.id;
        const updateditemData = produce(chatInfo, draft => {
          draft.users = draft.users.filter(user => user._id !== idToRemove);
        });
        setData(updateditemData);
      }
    },
    [userData?.id],
  );

  useEffect(() => {
    if (itemData) {
      setGroupData(itemData);
    }
  }, [itemData, setGroupData]);

  const isAdmin = useMemo(() => {
    const res = itemData.groupAdmin.find(
      (item: UserDataFromServer) => item._id === userData?.id,
    );
    if (res) {
      return true;
    }
    return false;
  }, [itemData.groupAdmin, userData?.id]);

  const onUserDeletePress = useCallback(
    async (userId: string) => {
      const mainData = {
        userId: userId,
        chatId: data._id,
      };
      Spinner.show();
      const res: any = await dispatch(removeUserFromGroupThunk(mainData));
      Spinner.hide();
      if (res.meta.requestStatus === 'fulfilled') {
        setGroupData(res.payload.data);
      }
    },
    [data._id, dispatch, setGroupData],
  );

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <CustomHeader
        rightAction={() => navigate(Routes.CREATE_GROUP, {})}
        rightIcon={images.plus}
        title={data.chatName}
      />

      <Box margin="s" flex={1} backgroundColor="mainBackground">
        <FlatList
          data={data.users}
          keyExtractor={item => item._id}
          renderItem={({item}) => (
            <RenderItem
              {...item}
              isAdmin={isAdmin}
              onUserDeletePress={onUserDeletePress}
            />
          )}
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
  });
};

export default GroupInfo;
