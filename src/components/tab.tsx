import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';

// Files
import InProgress from './InProgress';
import Completed from './Completed';
import Cancelled from './Cancelled';
import {getScreenHeight} from '../../utils/commonManager';
import {fonts} from '../../constants';
import localization from '../../localization';

const Tab = createMaterialTopTabNavigator();

const JobTopTabBar = () => {
  const theme = useSelector((state: any) => state.colors.theme);
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  const CustomTabBar = (props: any) => {
    const {navigationState, navigation} = props;
    return (
      <View style={styles.container}>
        {navigationState.routes.map((route: any, index: any) => {
          return (
            <Pressable
              key={index}
              onPress={() => {
                navigation.navigate(route.name);
              }}
              style={[
                styles.item,
                {
                  backgroundColor:
                    navigationState.index === index
                      ? theme.primaryColor
                      : 'transparent',
                },
              ]}>
              <Text
                style={{
                  fontFamily: fonts.avenirLTStdMedium,
                  fontSize: getScreenHeight(1.6),
                  color:
                    navigationState.index === index ? theme.white : theme.black,
                }}>
                {route.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
    );
  };

  return (
    <Tab.Navigator tabBar={props => <CustomTabBar {...props} />}>
      <Tab.Screen name={localization.inProgress} component={InProgress} />
      <Tab.Screen name={localization.completed} component={Completed} />
      <Tab.Screen name={localization.cancelled} component={Cancelled} />
    </Tab.Navigator>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.tab,
      height: getScreenHeight(6),
      marginTop: getScreenHeight(2),
      borderRadius: getScreenHeight(6),
      flexDirection: 'row',
      alignItems: 'center',
    },
    item: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      height: getScreenHeight(6),
      borderRadius: getScreenHeight(6),
    },
  });

export default JobTopTabBar;
