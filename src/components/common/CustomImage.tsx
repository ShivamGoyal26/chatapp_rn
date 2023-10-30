import React, {useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useTheme} from '@shopify/restyle';
import {useTranslation} from 'react-i18next';

// Files
import {ColorTheme, Theme} from '../../theme';
import {getScreenHeight} from '../../utils/commonServices';
import {Images} from '../../constants';
import {usePickAsset} from '../../hooks';

type CustomImageProps = {
  disabled?: boolean;
  uri?: string;
  action?: any;
};

const CustomImage = ({uri, action, disabled}: CustomImageProps) => {
  const theme = useTheme<Theme>();
  const {colors} = theme;
  const {t} = useTranslation();
  const {chooseImageFromCamera, chooseImageFromGallery} = usePickAsset();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoadStart = () => {
    setIsLoading(true);
  };

  const handleImageLoadEnd = () => {
    setIsLoading(false);
  };

  const onCameraPress = async () => {
    const res: any = await chooseImageFromCamera(5);
    if (res) {
      action(res);
    }
  };

  const onGalleryPress = async () => {
    const res: any = await chooseImageFromGallery(5);
    if (res) {
      action(res);
    }
  };

  const pickImage = async () => {
    setImageError(false);
    Alert.alert(
      t('appNamespace.selectChoice'),
      t('appNamespace.galleryOrCamera'),
      [
        {
          text: t('appNamespace.camera'),
          onPress: () => onCameraPress(),
        },
        {
          text: t('appNamespace.gallery'),
          onPress: async () => onGalleryPress(),
        },
      ],
    );
  };

  if (!uri || imageError) {
    return (
      <TouchableOpacity
        onPress={pickImage}
        disabled={!!disabled}
        style={styles.imageContainer}>
        <FastImage
          tintColor={colors.borderColor}
          resizeMode="contain"
          style={styles.icon}
          source={imageError ? Images.corruptImage : Images.profile}
        />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={pickImage}
      disabled={!!disabled}
      style={styles.imageContainer}>
      {isLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator />
        </View>
      ) : null}
      <FastImage
        style={styles.image}
        onError={handleImageError}
        onLoadStart={handleImageLoadStart}
        onLoadEnd={handleImageLoadEnd}
        source={{uri: uri}}
      />
    </TouchableOpacity>
  );
};

const createStyles = (theme: ColorTheme) =>
  StyleSheet.create({
    image: {
      width: '100%',
      height: '100%',
    },
    imageContainer: {
      width: getScreenHeight(12),
      height: getScreenHeight(12),
      borderRadius: getScreenHeight(7),
      borderWidth: getScreenHeight(0.1),
      borderColor: theme.borderColor,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    icon: {
      width: getScreenHeight(3),
      height: getScreenHeight(3),
    },
    loader: {
      position: 'absolute',
      zIndex: 10,
      alignSelf: 'center',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
  });

export default CustomImage;
