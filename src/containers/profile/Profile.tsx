import React, {useEffect, useMemo} from 'react';
import {
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
import {Box, CustomHeader, Text} from '../../components';
import {logoutThunk} from '../../redux/auth';

const Profile = () => {
  const theme = useTheme<Theme>();
  const {colors} = theme;
  const {t} = useTranslation();
  const userData = useSelector((state: RootState) => state.auth.userData);
  const dispatch: AppDispatch = useDispatch();

  const styles = useMemo(() => createStyles(colors), [colors]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(colors.mainBackground);
      StatusBar.setBarStyle('dark-content');
    }
  }, [colors?.mainBackground]);

  const logout = () => {
    dispatch(logoutThunk());
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <CustomHeader title={t('appNamespace.profile')} />

      <Box margin="s" flex={1} backgroundColor="mainBackground">
        <ScrollView>
          <Text variant="heading">
            {t('appNamespace.welcome')}, {userData?.name}
          </Text>
        </ScrollView>
        <TouchableOpacity onPress={logout} style={styles.action}>
          <Text variant="title">logout</Text>
        </TouchableOpacity>
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
    action: {
      alignSelf: 'flex-start',
    },
  });
};

export default Profile;
