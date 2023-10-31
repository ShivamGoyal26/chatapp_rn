import React, {useEffect, useMemo, useRef, useState} from 'react';
import {View, StyleSheet, Platform, Modal, Pressable} from 'react-native';
import {useSelector} from 'react-redux';
import Lottie from 'lottie-react-native';
import {useTheme} from '@shopify/restyle';
import {useTranslation} from 'react-i18next';

// Files
import {ColorTheme, Theme} from '../../theme';
import {RootState} from '../../redux/store';
import {Lotties} from '../../constants';
import Text from '../Text';
import {getScreenHeight} from '../../utils/commonServices';

const InternetConnection = () => {
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const isEnable: any = useRef();
  const theme = useTheme<Theme>();
  const {colors} = theme;
  const {t} = useTranslation();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const internet = useSelector((state: RootState) => state.common.isInternet);

  useEffect(() => {
    if (isEnable.current) {
      clearTimeout(isEnable.current);
    }

    isEnable.current = setTimeout(() => {
      if (internet) {
        setShowModal(true);
        setTimeout(() => {
          setShow(false);
          setShowModal(false);
        }, 4500);
      } else {
        setShow(true);
      }
    }, 1000);
  }, [internet]);

  if (show) {
    return (
      <Modal visible={true} animationType="slide" transparent={true}>
        <Pressable disabled={true} style={styles.modalScreen}>
          {showModal ? (
            <View style={styles.container}>
              <Lottie
                style={theme.cardVariants.lottie}
                source={Lotties.noInternet}
                autoPlay
                loop
              />
              <Text marginBottom="l" color="success" variant="heading">
                {t('appNamespace.weAreOnline')}
              </Text>
            </View>
          ) : (
            <View style={styles.container}>
              <Lottie
                style={theme.cardVariants.lottie}
                source={Lotties.noInternet}
                autoPlay
                loop
              />
              <Text marginBottom="l" color="error" variant="heading">
                {t('appNamespace.noInternet')}
              </Text>
            </View>
          )}
        </Pressable>
      </Modal>
    );
  }

  return null;
};

const createStyles = (theme: ColorTheme) =>
  StyleSheet.create({
    screen: {
      backgroundColor: theme.primary,
      height: getScreenHeight(3),
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      bottom: Platform.OS === 'ios' ? getScreenHeight(2) : 0,
      width: '100%',
      zIndex: 10,
      elevation: 1,
    },
    modalScreen: {
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      flex: 1,
      justifyContent: 'flex-end',
    },
    container: {
      backgroundColor: theme.mainBackground,
      height: getScreenHeight(40),
      borderTopLeftRadius: getScreenHeight(2),
      borderTopRightRadius: getScreenHeight(2),
      padding: getScreenHeight(2),
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default InternetConnection;
