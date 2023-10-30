import {Alert} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {showMessage} from 'react-native-flash-message';
import {useTranslation} from 'react-i18next';
import {useCallback, useEffect} from 'react';

// Files
import useAssetAccess from './useAssetAccess';

const usePickAsset = () => {
  const {t} = useTranslation();
  const {askGalleryPermissions, askCameraPermission} = useAssetAccess();

  const chooseImageFromGallery = useCallback(
    async (size: number) => {
      try {
        let res = await askGalleryPermissions();
        if (res) {
          const options: any = {
            title: t('appNamespace.selectImage'),
            storageOptions: {
              skipBackup: true,
              path: 'images',
            },
            mediaType: 'photo',
            // selectionLimit: 0 // for selecting the multiple images
          };

          const response: any = await launchImageLibrary(options);
          if (response?.assets) {
            let sizeOfFile = response.assets[0].fileSize / 1000000;
            let desiredSize = size ? size : 15;
            if (+desiredSize < sizeOfFile) {
              showMessage({
                message: t('appNamespace.maxSize'),
                type: 'warning',
              });
              return;
            }
          } else if (response.didCancel) {
            throw new Error('User cancelled image picker');
          } else if (response.error) {
            throw new Error(response.error);
          } else if (response.customButton) {
            throw new Error('User tapped custom button');
          }

          let typeArray = response.assets[0].type.split('/');
          if (
            typeArray[typeArray.length - 1] === 'jpeg' ||
            typeArray[typeArray.length - 1] === 'png' ||
            typeArray[typeArray.length - 1] === 'jpg'
          ) {
            return response.assets[0];
          } else {
            return Alert.alert(t('messagesNamespace.selectValidImage'));
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    [askGalleryPermissions, t],
  );

  const chooseImageFromCamera = useCallback(
    async (size: number) => {
      try {
        let res = await askCameraPermission();
        if (res) {
          const options: any = {
            title: t('appNamespace.selectImage'),
            storageOptions: {
              skipBackup: true,
              path: 'images',
            },
            mediaType: 'photo',
            maxWidth: 800,
            maxHeight: 800,
            quality: 0.5,
          };

          const response: any = await launchCamera(options);
          if (response?.assets) {
            let sizeOfFile = response.assets[0].fileSize / 1000000;
            let desiredSize = size ? size : 5;
            if (+desiredSize < sizeOfFile) {
              showMessage({
                message: t('appNamespace.maxSize'),
                type: 'warning',
              });
              return;
            }
          }
          if (response.errorCode === 'camera_unavailable') {
            return Alert.alert(t('messagesNamespace.cameraNotAvailable'));
          } else if (response.didCancel) {
            throw new Error('User cancelled image picker');
          } else if (response.error) {
            throw new Error(response.error);
          } else if (response.customButton) {
            throw new Error('User tapped custom button');
          } else {
            let typeArray = response.assets[0].type.split('/');
            if (
              typeArray[typeArray.length - 1] === 'jpeg' ||
              typeArray[typeArray.length - 1] === 'png' ||
              typeArray[typeArray.length - 1] === 'jpg'
            ) {
              return response.assets[0];
            } else {
              return Alert.alert(t('messagesNamespace.selectValidImage'));
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    [askCameraPermission, t],
  );

  useEffect(() => {
    console.log('RENDER');
  }, [chooseImageFromGallery, chooseImageFromCamera]);

  return {
    chooseImageFromGallery,
    chooseImageFromCamera,
  };
};

export default usePickAsset;
