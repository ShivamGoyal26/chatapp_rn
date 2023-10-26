import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useColorScheme} from 'react-native';
import {PersistGate} from 'redux-persist/integration/react';
import {Provider} from 'react-redux';

// Files
import './src/locales/index'; // import i18n (needs to be bundled ;))
import {DarkTheme, LightTheme} from './src/theme';
import {NavigationRef} from './src/utils/routerServices';
import {MainStack} from './src/routers';
import {persistor, store} from './src/redux/store';

const App = () => {
  const colorScheme = useColorScheme();

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <SafeAreaProvider>
          <NavigationContainer
            theme={colorScheme === 'light' ? LightTheme : DarkTheme}
            ref={NavigationRef}>
            <MainStack />
          </NavigationContainer>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
