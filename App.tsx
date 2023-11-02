import React, {useEffect} from 'react';
import {AppState, Platform} from 'react-native';
import type {AppStateStatus} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StyleSheet, useColorScheme} from 'react-native';
import {PersistGate} from 'redux-persist/integration/react';
import {Provider} from 'react-redux';
import {ThemeProvider} from '@shopify/restyle';
import NetInfo from '@react-native-community/netinfo';
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
  onlineManager,
} from '@tanstack/react-query';
import FlashMessage from 'react-native-flash-message';
import Config from 'react-native-config';

// Files
import './src/locales/index'; // import i18n (needs to be bundled ;))
import {NavigationRef} from './src/utils/routerServices';
import {MainStack} from './src/routers';
import {persistor, store} from './src/redux/store';
import {darkTheme, theme} from './src/theme';
import {Fonts} from './src/constants';
import {getScreenHeight} from './src/utils/commonServices';
import {Text} from './src/components';

onlineManager.setEventListener(setOnline => {
  return NetInfo.addEventListener(state => {
    setOnline(!!state.isConnected);
  });
});

const queryClient = new QueryClient();

const App = () => {
  const colorScheme = useColorScheme();

  function onAppStateChange(status: AppStateStatus) {
    if (Platform.OS !== 'web') {
      focusManager.setFocused(status === 'active');
    }
  }

  useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange);

    return () => subscription.remove();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={colorScheme === 'light' ? theme : darkTheme}>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <SafeAreaProvider>
              <NavigationContainer ref={NavigationRef}>
                <FlashMessage titleStyle={styles.title} position="top" />
                <Text variant={'heading'}>{Config.ENV} Testing</Text>
                <MainStack />
              </NavigationContainer>
            </SafeAreaProvider>
          </PersistGate>
        </Provider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: Fonts.medium,
    fontSize: getScreenHeight(1.8),
  },
});

export default App;
