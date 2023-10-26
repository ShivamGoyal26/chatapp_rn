import {useTheme} from '@react-navigation/native';
import React, {useEffect, useMemo} from 'react';
import {Platform, StatusBar, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';

// Files
import {Colors} from '../../theme/types';
import {getScreenHeight} from '../../utils/commonServices';
import {AppDispatch, RootState} from '../../redux/store';
import {getUserDataThunk} from '../../redux/auth';

const Login = () => {
  const theme = useTheme();
  const {colors} = theme;
  const {t} = useTranslation();
  const userData = useSelector((state: RootState) => state.auth.userData);
  const dispatch: AppDispatch = useDispatch();

  const styles = useMemo(() => createStyles(colors), [colors]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(colors.background);
      StatusBar.setBarStyle('dark-content');
    }
    getUserData();
  }, [colors?.background]);

  const getUserData = async () => {
    try {
      const val = await dispatch(getUserDataThunk('demo!gm'));
      console.log(val, userData);
    } catch (error) {
      console.log('Rjkd', error);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.screen}>
        <Text>{t('appNamespace.appName')}</Text>
      </View>
    </SafeAreaView>
  );
};

const createStyles = (theme: Colors) => {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
      paddingHorizontal: getScreenHeight(2),
    },
    safe: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
    },
  });
};

export default Login;
