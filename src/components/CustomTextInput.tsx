import React, {useMemo} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  TextInputProps,
} from 'react-native';
import FastImage, {FastImageProps} from 'react-native-fast-image';
import {getScreenHeight} from '../utils/commonServices';
import Text from './Text';
import {Fonts} from '../constants';
import {ColorTheme, Theme} from '../theme';
import {useTheme} from '@shopify/restyle';

// Define the TypeScript types for CustomTextInputProps
type CustomTextInputProps = {
  label?: string;
  star?: boolean;
  leftIcon?: FastImageProps['source'];
  leftAction?: () => void;
  leftTint?: string;
  rightIcon?: FastImageProps['source'];
  rightAction?: () => void;
  rightTint?: string;
  editable?: boolean;
  inputRef?: React.RefObject<TextInput>;
  onSubmit?: () => void;
  type?: TextInputProps['returnKeyType'];
  secure?: boolean;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  error?: string;
  textAreaInput?: boolean;
  onBlur?: () => void;
};

const CustomTextInput = ({
  label,
  star,
  leftIcon,
  leftAction,
  leftTint,
  rightIcon,
  rightAction,
  rightTint,
  editable,
  inputRef,
  onSubmit,
  type,
  secure,
  value,
  onChangeText,
  placeholder,
  error,
  textAreaInput,
  onBlur,
  ...props
}: CustomTextInputProps) => {
  const theme = useTheme<Theme>();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View>
      {label ? (
        <Text numberOfLines={1} mb="s" variant="title">
          {label}
          <Text style={{color: colors.error}}>{star ? '*' : ''}</Text>
        </Text>
      ) : null}
      <View
        style={[
          styles.mainContainer,
          {
            height: textAreaInput
              ? Platform.OS === 'android'
                ? getScreenHeight(10)
                : getScreenHeight(10)
              : Platform.OS === 'android'
              ? getScreenHeight(6)
              : getScreenHeight(6),
          },
        ]}>
        {leftIcon ? (
          <TouchableOpacity
            disabled={leftAction ? false : true}
            onPress={leftAction}
            style={styles.iconContanier}>
            <FastImage
              tintColor={leftTint}
              resizeMode="contain"
              style={styles.icon}
              source={leftIcon}
            />
          </TouchableOpacity>
        ) : (
          <View style={{marginRight: getScreenHeight(1)}} />
        )}
        <View style={styles.textInputContanier}>
          <TextInput
            {...props}
            onBlur={onBlur}
            autoCorrect={true}
            editable={editable}
            ref={inputRef}
            onSubmitEditing={onSubmit}
            returnKeyType={type ? type : 'done'}
            style={{...styles.textInput}}
            secureTextEntry={secure}
            value={value}
            onChangeText={onChangeText}
            placeholderTextColor={colors.borderColor}
            placeholder={placeholder}
          />
        </View>
        {rightIcon ? (
          <TouchableOpacity
            disabled={rightAction ? false : true}
            onPress={rightAction}
            style={[
              styles.iconContanier,
              {
                height: textAreaInput
                  ? Platform.OS === 'android'
                    ? getScreenHeight(12)
                    : getScreenHeight(12)
                  : Platform.OS === 'android'
                  ? getScreenHeight(6)
                  : getScreenHeight(6),
              },
            ]}>
            <FastImage
              resizeMode="contain"
              style={styles.icon}
              source={rightIcon}
              tintColor={rightTint}
            />
          </TouchableOpacity>
        ) : (
          <View style={{marginRight: getScreenHeight(1)}} />
        )}
      </View>
      {error ? (
        <Text numberOfLines={1} mt="s" variant="error">
          {error}
        </Text>
      ) : null}
    </View>
  );
};

const createStyles = (theme: ColorTheme) =>
  StyleSheet.create({
    textInput: {
      alignItems: 'center',
      height: '90%',
      padding: 0,
      textAlign: 'left',
      backgroundColor: theme.mainBackground,
      fontFamily: Fonts.regular,
      color: theme.mainForeground,
    },
    mainContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderColor: theme.borderColor,
      borderWidth: getScreenHeight(0.1),
      borderRadius: getScreenHeight(1),
      backgroundColor: theme.mainBackground,
    },
    textInputContanier: {
      flex: 1,
    },
    iconContanier: {
      width: '10%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    icon: {
      height: getScreenHeight(2.5),
      width: getScreenHeight(2.5),
    },
  });

export default CustomTextInput;
