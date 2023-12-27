import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StyleSheet, useColorScheme} from 'react-native';
import {PersistGate} from 'redux-persist/integration/react';
import {Provider} from 'react-redux';
import {ThemeProvider} from '@shopify/restyle';
import FlashMessage from 'react-native-flash-message';
import firestore from '@react-native-firebase/firestore';

// Files
import './src/locales/index'; // import i18n (needs to be bundled ;))
import {NavigationRef} from './src/utils/routerServices';
import {MainStack} from './src/routers';
import {persistor, store} from './src/redux/store';
import {darkTheme, theme} from './src/theme';
import {Fonts} from './src/constants';
import {getScreenHeight} from './src/utils/commonServices';

const App = () => {
  console.log('This is the new change in the App.tsx');
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider theme={colorScheme === 'light' ? theme : darkTheme}>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <SafeAreaProvider>
            <NavigationContainer ref={NavigationRef}>
              <FlashMessage titleStyle={styles.title} position="top" />
              <MainStack />
            </NavigationContainer>
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: Fonts.medium,
    fontSize: getScreenHeight(1.8),
  },
});

export default App;
