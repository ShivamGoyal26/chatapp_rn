import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useColorScheme} from 'react-native';
import {PersistGate} from 'redux-persist/integration/react';
import {Provider} from 'react-redux';
import {ThemeProvider} from '@shopify/restyle';
// Files
import './src/locales/index'; // import i18n (needs to be bundled ;))
import {NavigationRef} from './src/utils/routerServices';
import {MainStack} from './src/routers';
import {persistor, store} from './src/redux/store';
import {darkTheme, theme} from './src/theme';

const App = () => {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider theme={colorScheme === 'light' ? theme : darkTheme}>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <SafeAreaProvider>
            <NavigationContainer
              // theme={colorScheme === 'light' ? LightTheme : DarkTheme}
              ref={NavigationRef}>
              <MainStack />
            </NavigationContainer>
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </ThemeProvider>
  );
};

export default App;
