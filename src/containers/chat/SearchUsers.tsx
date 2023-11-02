import React, {useEffect, useMemo} from 'react';
import {Platform, StatusBar, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@shopify/restyle';

// Files
import {getScreenHeight} from '../../utils/commonServices';
import {ColorTheme, Theme} from '../../theme';
import {Box, CustomHeader, LoadUsers} from '../../components';

const SearchUsers = () => {
  const theme = useTheme<Theme>();
  const {colors} = theme;
  const {t} = useTranslation();

  const styles = useMemo(() => createStyles(colors), [colors]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(colors.mainBackground);
      StatusBar.setBarStyle('dark-content');
    }
  }, [colors?.mainBackground]);

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <CustomHeader title={t('appNamespace.searchUsers')} />
      <Box marginHorizontal={'m'}>
        <LoadUsers />
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

export default SearchUsers;
