import React, {useMemo} from 'react';
import {ActivityIndicator, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from '@shopify/restyle';
import {useSelector} from 'react-redux';

// Files
import {getScreenHeight} from '../utils/commonServices';
import FastImage from 'react-native-fast-image';
import Text from './Text';
import {ColorTheme, Theme} from '../theme';
import {RootState} from '../redux/store';

type CustomButtonProps = {
  title: string;
  disabled?: boolean;
  action?: () => void;
  height?: number;
  icon?: any;
  iconColor?: string;
};

const CustomButton = ({
  title,
  disabled,
  action,
  height,
  icon,
  iconColor,
}: CustomButtonProps) => {
  const theme = useTheme<Theme>();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(colors), [colors]);
  const loading = useSelector((state: RootState) => state.common.loading);

  return (
    <TouchableOpacity
      disabled={disabled || loading}
      onPress={action}
      activeOpacity={0.7}
      style={[
        styles.screen,
        {
          height: height ? height : getScreenHeight(6),
        },
      ]}>
      {loading ? (
        <ActivityIndicator color={colors.mainBackground} size={'small'} />
      ) : (
        <>
          {icon ? (
            <FastImage
              tintColor={iconColor ? iconColor : colors.mainBackground}
              style={styles.icon}
              source={icon}
              resizeMode="contain"
            />
          ) : null}
          <Text color="mainBackground" variant="title">
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const createStyles = (theme: ColorTheme) =>
  StyleSheet.create({
    screen: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.primaryCardBackground,
      borderRadius: getScreenHeight(1),
      flexDirection: 'row',
    },

    icon: {
      width: getScreenHeight(2.5),
      height: getScreenHeight(2.5),
      marginRight: getScreenHeight(1),
    },
  });

export default CustomButton;
