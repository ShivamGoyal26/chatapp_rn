import {useCallback} from 'react';
import {Alert, Linking, Platform} from 'react-native';
import {PERMISSIONS, check, request} from 'react-native-permissions';
import {useTranslation} from 'react-i18next';

const useAssetAccess = () => {
  const {t} = useTranslation();

  const checkCameraPermission = useCallback(async () => {
    try {
      const permissionAvailable = await check(
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.CAMERA
          : PERMISSIONS.ANDROID.CAMERA,
      );
      if (permissionAvailable === 'granted') {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }, []);

  const askCameraPermission = useCallback(async () => {
    try {
      const cameraPermissionAvailable = await checkCameraPermission();
      if (cameraPermissionAvailable) {
        return true;
      }
      const result = await request(
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.CAMERA
          : PERMISSIONS.ANDROID.CAMERA,
      );
      if (result !== 'granted') {
        Alert.alert(
          t('appNamespace.cameraPermissionDenied'),
          t('appNamespace.pleaseProvideAccess'),
          [
            {
              text: t('appNamespace.cancel'),
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: t('appNamespace.openSettings'),
              onPress: () => Linking.openSettings(),
            },
          ],
        );
      } else {
        // we have permission
        return true;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }, [checkCameraPermission, t]);

  const checkGalleryPermissions = useCallback(async () => {
    try {
      const permissionAvailable = await check(
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.PHOTO_LIBRARY
          : +Platform.Version >= 33
          ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
          : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      );
      if (permissionAvailable === 'granted') {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }, []);

  const askGalleryPermissions = useCallback(async () => {
    try {
      const permissionAvailable = await checkGalleryPermissions();
      if (permissionAvailable) {
        return true;
      }
      const result = await request(
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.PHOTO_LIBRARY
          : +Platform.Version >= 33
          ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
          : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      );
      if (result !== 'granted') {
        return Alert.alert(
          t('appNamespace.galleryPermissionDenied'),
          t('appNamespace.pleaseProvideAccess'),
          [
            {
              text: t('appNamespace.cancel'),
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: t('appNamespace.openSettings'),
              onPress: () => Linking.openSettings(),
            },
          ],
        );
      } else {
        // we have permission
        return true;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }, [checkGalleryPermissions, t]);

  return {
    checkCameraPermission,
    askCameraPermission,
    checkGalleryPermissions,
    askGalleryPermissions,
  };
};

export default useAssetAccess;
