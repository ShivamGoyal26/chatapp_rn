import {useTheme} from '@shopify/restyle';
import React, {forwardRef, useImperativeHandle, useMemo, useState} from 'react';
import {
  Modal,
  StyleSheet,
  Pressable,
  View,
  StatusBar,
  ActivityIndicator,
} from 'react-native';

// Files
import {ColorTheme, Theme} from '../../theme';
import {getScreenHeight, getScreenWidth} from '../../utils/commonServices';

const CustomLoadingModal = forwardRef((props: any, ref: any) => {
  const theme = useTheme<Theme>();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [loading, setLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    show() {
      setLoading(true);
    },
    hide() {
      setLoading(false);
    },
  }));

  if (loading) {
    return (
      <>
        <Modal
          visible={props.visible}
          animationType="fade"
          transparent={true}
          {...props}>
          <StatusBar barStyle={'dark-content'} />
          <Pressable onPress={props.pressHandler} style={styles.modalScreen}>
            <View style={styles.modalContanier}>
              <ActivityIndicator />
            </View>
          </Pressable>
        </Modal>
      </>
    );
  }

  return null;
});

const createStyles = (theme: ColorTheme) =>
  StyleSheet.create({
    modalScreen: {
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContanier: {
      // backgroundColor: theme.white,
      width: getScreenWidth(90),
      alignSelf: 'center',
      borderRadius: getScreenHeight(1),
      justifyContent: 'center',
      alignItems: 'center',
    },
    icon: {
      width: getScreenHeight(8),
      height: getScreenHeight(8),
    },
  });

export default CustomLoadingModal;
