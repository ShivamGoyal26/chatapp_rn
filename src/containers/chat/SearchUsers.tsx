import React, {useEffect, useMemo} from 'react';
import {Platform, StatusBar, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@shopify/restyle';

// Files
import {getScreenHeight} from '../../utils/commonServices';
import {AppDispatch} from '../../redux/store';
import {ColorTheme, Theme} from '../../theme';
import {Box, CustomHeader, UserSearch} from '../../components';
import {findUsersThunk} from '../../redux/auth';
import {SearchUsersRequestData} from '../../types/common';

const SearchUsers = () => {
  const theme = useTheme<Theme>();
  const {colors} = theme;
  const {t} = useTranslation();
  const dispatch: AppDispatch = useDispatch();

  const styles = useMemo(() => createStyles(colors), [colors]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(colors.mainBackground);
      StatusBar.setBarStyle('dark-content');
    }
  }, [colors?.mainBackground]);

  const findUsers = (keyword: string) => {
    let data: SearchUsersRequestData = {
      search: keyword,
      limit: 10,
      page: 1,
    };
    dispatch(findUsersThunk(data));
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <CustomHeader title={t('appNamespace.searchUsers')} />

      <Box marginHorizontal="s" flex={1} backgroundColor="mainBackground">
        <UserSearch action={findUsers} />
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
