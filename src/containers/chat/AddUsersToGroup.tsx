import React, {useEffect, useMemo, useRef} from 'react';
import {Platform, StatusBar, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@shopify/restyle';
import {useDispatch, useSelector} from 'react-redux';

// Files
import {getScreenHeight} from '../../utils/commonServices';
import {ColorTheme, Theme} from '../../theme';
import {Box, CustomButton, CustomHeader, SelectUsers} from '../../components';
import {Images} from '../../constants';
import {goBack} from '../../utils/routerServices';
import {AppDispatch, RootState} from '../../redux/store';
import {SelectUserData} from '../../types/auth';
import {addUserFromGroupThunk, setChatInfo} from '../../redux/chat';
import Spinner from '../../utils/spinnerRef';

const AddUsersToGroup = () => {
  const theme = useTheme<Theme>();
  const {colors} = theme;
  const dispatch = useDispatch<AppDispatch>();
  const {t} = useTranslation();
  const selectedUsers = useRef<any>();
  const chatinfo = useSelector((state: RootState) => state.chat.chatInfo);

  const existingUsers = chatinfo?.users;

  const styles = useMemo(() => createStyles(colors), [colors]);

  useEffect(() => {
    selectedUsers.current.setDisableItems(existingUsers);
  }, [existingUsers]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(colors.mainBackground);
      StatusBar.setBarStyle('dark-content');
    }
  }, [colors?.mainBackground]);

  const onAddUserPress = async () => {
    let selectedUsersByUser = selectedUsers.current
      .getSelectedItem()
      ?.map((item: SelectUserData) => item._id);

    let bodyData = {
      chatId: chatinfo?._id,
      userIds: selectedUsersByUser,
    };
    Spinner.show();
    const res: any = await dispatch(addUserFromGroupThunk(bodyData));
    Spinner.hide();
    if (res.meta.requestStatus === 'fulfilled') {
      dispatch(setChatInfo(res.payload.data));
      goBack();
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <CustomHeader
        leftIcon={Images.back}
        leftAction={goBack}
        leftIconColor={colors.mainForeground}
        title={t('appNamespace.addMembers')}
      />
      <Box flex={1} marginHorizontal={'m'} backgroundColor={'mainBackground'}>
        <SelectUsers ref={selectedUsers} />
        <Box marginVertical="l">
          <CustomButton action={onAddUserPress} title={t('appNamespace.add')} />
        </Box>
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

export default AddUsersToGroup;
