import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  I18nManager,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@shopify/restyle';

// Files
import {getScreenHeight} from '../../utils/commonServices';
import {AppDispatch, RootState} from '../../redux/store';
import {ColorTheme, Theme} from '../../theme';
import {Box, CustomHeader, CustomImage, Text} from '../../components';
import {logoutThunk} from '../../redux/auth';
import {getAssetsThunk} from '../../redux/assets';

const Profile = () => {
  const theme = useTheme<Theme>();
  const {colors} = theme;
  const {t} = useTranslation();
  const userData = useSelector((state: RootState) => state.auth.userData);
  const dispatch: AppDispatch = useDispatch();

  const styles = useMemo(() => createStyles(colors), [colors]);

  const [pic, setPic] = useState<null | string | undefined>(null);

  const getUserPic = useCallback(
    async (key: string) => {
      if (key) {
        const res = await dispatch(getAssetsThunk(key));
        if (res.meta.requestStatus === 'fulfilled') {
          setPic(res.payload as string | null | undefined);
        }
      }
    },
    [dispatch],
  );

  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(colors.mainBackground);
      StatusBar.setBarStyle('dark-content');
    }
    if (userData?.pic) {
      getUserPic(userData?.pic);
    }
  }, [colors.mainBackground, getUserPic, userData?.pic]);

  const logout = () => {
    dispatch(logoutThunk());
    // I18nManager.forceRTL(true);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <CustomHeader title={t('appNamespace.profile')} />

      <Box margin="s" flex={1} backgroundColor="mainBackground">
        <ScrollView>
          <Text variant="heading" color="mainForeground">
            {t('appNamespace.welcome')}, {userData?.name}
          </Text>

          <Box my="l" alignSelf="center">
            <CustomImage uri={pic} disabled={true} />
          </Box>

          <Text variant="title">{userData?.email}</Text>

          <TouchableOpacity onPress={logout} style={styles.action}>
            <Text variant="title" color="error">
              logout
            </Text>
          </TouchableOpacity>
        </ScrollView>
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

    action: {
      alignSelf: 'flex-start',
      marginTop: getScreenHeight(5),
    },
  });
};

export default Profile;
