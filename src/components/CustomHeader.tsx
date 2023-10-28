import React, {useMemo} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useTheme} from '@shopify/restyle';

// Files
import {getScreenHeight} from '../utils/commonServices';
import {ColorTheme, Theme} from '../theme';
import Text from './Text';

type CustomHeaderProps = {
  title?: string;
  leftIcon?: any;
  rightIcon?: any;
  leftAction?: () => void;
  rightAction?: () => void;
  leftIconColor?: string;
  rightIconColor?: string;
};

const CustomHeader = ({
  title,
  leftIcon,
  rightIcon,
  leftAction,
  rightAction,
  leftIconColor,
  rightIconColor,
}: CustomHeaderProps) => {
  const theme = useTheme<Theme>();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.screen}>
      {leftIcon ? (
        <TouchableOpacity
          disabled={!leftAction}
          onPress={leftAction}
          style={styles.iconContainer}>
          <FastImage
            tintColor={leftIconColor}
            resizeMode="contain"
            source={leftIcon}
            style={styles.icon}
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconContainer} />
      )}

      <Text
        textAlign="center"
        variant="heading"
        style={styles.title}
        numberOfLines={2}>
        {title}
      </Text>

      {rightIcon ? (
        <TouchableOpacity
          disabled={!rightAction}
          onPress={rightAction}
          style={styles.iconContainer}>
          <FastImage
            tintColor={rightIconColor}
            resizeMode="contain"
            source={rightIcon}
            style={styles.icon}
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconContainer} />
      )}
    </View>
  );
};

const createStyles = (theme: ColorTheme) =>
  StyleSheet.create({
    screen: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: getScreenHeight(8),
      backgroundColor: theme.mainBackground,
    },

    iconContainer: {
      width: '10%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    icon: {
      width: getScreenHeight(2.5),
      height: getScreenHeight(2.5),
    },
    title: {
      flex: 1,
    },
  });

export default CustomHeader;
