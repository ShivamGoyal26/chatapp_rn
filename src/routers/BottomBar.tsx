import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from '@shopify/restyle';
import {useTranslation} from 'react-i18next';

// Files
import {Profile, SearchUsers} from '../containers';
import {Images, Routes} from '../constants';
import Chats from '../containers/chat/Chats';
import {Text} from '../components';
import {Theme} from '../theme';
import {getScreenHeight} from '../utils/commonServices';

const Tab = createBottomTabNavigator();

const TabButton = (props: any) => {
  const {item, accessibilityState, styles, onPress} = props;
  const focused = accessibilityState.selected;
  const theme = useTheme<Theme>();
  const {colors} = theme;

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Image
        resizeMode="contain"
        source={item.icon}
        style={[
          styles.icon,
          {
            tintColor: focused
              ? colors.secondaryCardBackground
              : colors.mainForeground,
          },
        ]}
      />
      <Text
        variant="title"
        style={{
          color: focused
            ? colors.secondaryCardBackground
            : colors.mainForeground,
        }}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );
};

const BottomBar = () => {
  const theme = useTheme<Theme>();
  const {colors} = theme;
  const {t} = useTranslation();

  const screens = [
    {
      name: Routes.CHATS,
      component: Chats,
      label: t('appNamespace.chats'),
      icon: Images.chats,
      badges: 2,
      hide: null,
    },
    {
      name: Routes.SEARCH_USERS,
      component: SearchUsers,
      label: t('appNamespace.search'),
      icon: Images.search,
      badges: null,
      hide: null,
    },
    {
      name: Routes.PROFILE,
      component: Profile,
      label: t('appNamespace.profile'),
      icon: Images.profile,
      badges: null,
      hide: null,
    },
  ];

  return (
    <Tab.Navigator
      backBehavior="none"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.mainBackground,
          height: getScreenHeight(8),
          borderTopWidth: 0,
          width: '100%',
          alignSelf: 'center',
          // borderRadius: 60,
          // marginBottom: 10,
        },
      }}
      initialRouteName="Home">
      {screens.map((item, key) => {
        return (
          <Tab.Screen
            key={key}
            options={{
              tabBarBadge: 10,
              tabBarButton: props =>
                item.hide ? null : (
                  <TabButton styles={styles} {...props} item={item} />
                ),
            }}
            name={item.name}
            component={item.component}
          />
        );
      })}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  icon: {
    height: 20,
    width: 20,
    tintColor: 'white',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    height: getScreenHeight(8),
  },
});

export default BottomBar;
