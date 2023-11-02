import React, {useMemo} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useTheme} from '@shopify/restyle';
import {useTranslation} from 'react-i18next';

// Files
import {Profile, SearchUsers} from '../containers';
import {Images, Routes} from '../constants';
import Chats from '../containers/chat/Chats';
import {Text} from '../components';
import {ColorTheme, Theme} from '../theme';
import {getScreenHeight} from '../utils/commonServices';

const Tab = createBottomTabNavigator();

const TabButton = (props: any) => {
  const {item, accessibilityState, styles, onPress} = props;
  const focused = accessibilityState.selected;
  const theme = useTheme<Theme>();
  const {colors} = theme;

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View>
        {item.badges ? (
          <View style={styles.badgeContainer}>
            <Text color={'mainBackground'} variant={'heading'}>
              {item.badges}
            </Text>
          </View>
        ) : null}
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
      </View>
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
  const styles = useMemo(() => createStyles(colors), [colors]);

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
          // borderTopWidth: 0,
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

const createStyles = (theme: ColorTheme) => {
  return StyleSheet.create({
    icon: {
      height: getScreenHeight(2.5),
      width: getScreenHeight(2.5),
    },
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      height: getScreenHeight(8),
    },
    badgeContainer: {
      paddingHorizontal: getScreenHeight(0.8),
      backgroundColor: theme.error,
      position: 'absolute',
      zIndex: 10,
      top: -getScreenHeight(1),
      right: -getScreenHeight(2.4),
      borderRadius: getScreenHeight(100),
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

export default BottomBar;
