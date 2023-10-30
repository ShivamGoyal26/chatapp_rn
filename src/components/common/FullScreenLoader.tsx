import {useTheme} from '@shopify/restyle';
import React, {useEffect, useMemo} from 'react';
import {
  ActivityIndicator,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

// Files
import {ColorTheme, Theme} from '../../theme';

const FullScreenLoader = () => {
  const theme = useTheme<Theme>();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(colors), [colors]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(colors.mainBackground);
      StatusBar.setBarStyle('dark-content');
    }
  }, [colors?.mainBackground]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.screen}>
        <ActivityIndicator size={'small'} color={colors.mainForeground} />
      </View>
    </SafeAreaView>
  );
};

const createStyles = (theme: ColorTheme) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: theme.mainBackground,
    },
    screen: {
      flex: 1,
      backgroundColor: theme.mainBackground,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default FullScreenLoader;
