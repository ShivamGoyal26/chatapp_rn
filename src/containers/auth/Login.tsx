import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Keyboard,
  Platform,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useForm, Controller, SubmitHandler} from 'react-hook-form';
import {useTheme} from '@shopify/restyle';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import Lottie from 'lottie-react-native';

// Files
import {getScreenHeight} from '../../utils/commonServices';
import {AppDispatch} from '../../redux/store';
import {emailRegex} from '../../utils/regex';
import {ColorTheme, Theme} from '../../theme';
import {loginThunk} from '../../redux/auth';
import {LoginInputData} from '../../types/auth';
import {navigate} from '../../utils/routerServices';
import {Images, Lotties, Routes} from '../../constants';
import {
  Box,
  CustomButton,
  CustomHeader,
  CustomTextInput,
  Text,
} from '../../components';

const Login = () => {
  const theme = useTheme<Theme>();
  const {colors} = theme;
  const {t} = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const styles = useMemo(() => createStyles(colors), [colors]);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const cancelToken = useRef<any>();

  const [secure, setSecure] = useState(true);

  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(colors.mainBackground);
      StatusBar.setBarStyle('dark-content');
    }
    return () => {
      if (cancelToken?.current) {
        cancelToken.current('Cancelled');
      }
    };
  }, [colors?.mainBackground]);

  const {
    control,
    handleSubmit,
    formState: {errors},
    trigger,
  } = useForm<LoginInputData>();

  const onLoginPress: SubmitHandler<LoginInputData> = async data => {
    const {cancel, token} = axios.CancelToken.source();
    cancelToken.current = cancel;
    dispatch(loginThunk({data: data, cancelToken: token}));
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <CustomHeader title={t('appNamespace.login')} />
      <KeyboardAwareScrollView
        bounces={false}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        enableAutomaticScroll={Platform.OS === 'ios'}
        contentContainerStyle={{flexGrow: 1}}>
        <Box margin="s" flex={1} backgroundColor="mainBackground">
          <Lottie
            style={theme.cardVariants.lottie}
            source={Lotties.login}
            autoPlay
            loop
          />
          <Box marginBottom="m">
            <Controller
              name="email"
              control={control}
              rules={{
                required: t('messagesNamespace.emailRequired'),
                pattern: {
                  value: emailRegex,
                  message: t('messagesNamespace.validEmail'),
                },
              }}
              defaultValue="shivam@shivam.com"
              render={({field}) => (
                <CustomTextInput
                  rightTint={colors.mainForeground}
                  autoCapitalize="none"
                  inputRef={emailRef}
                  label={t('appNamespace.emailTitle')}
                  onChangeText={field.onChange}
                  value={field.value}
                  placeholder={t('appNamespace.email')}
                  onBlur={() => trigger('email')}
                  error={errors.email?.message}
                  type="next"
                  onSubmit={() => {
                    passwordRef.current?.focus();
                  }}
                />
              )}
            />
          </Box>

          <Box marginBottom="m">
            <Controller
              name="password"
              control={control}
              rules={{
                required: t('messagesNamespace.passwordRequired'),
                minLength: {
                  value: 6,
                  message: t('messagesNamespace.validPassword'),
                },
              }}
              defaultValue="123456"
              render={({field}) => (
                <CustomTextInput
                  rightIcon={secure ? Images.show : Images.hide}
                  rightAction={() => setSecure(pre => !pre)}
                  secure={secure}
                  inputRef={passwordRef}
                  label={t('appNamespace.passwordTitle')}
                  onChangeText={field.onChange}
                  value={field.value}
                  placeholder={t('appNamespace.password')}
                  onBlur={() => trigger('password')}
                  error={errors.password?.message}
                  type="next"
                  onSubmit={() => {
                    Keyboard.dismiss();
                    handleSubmit(onLoginPress);
                  }}
                />
              )}
            />
          </Box>

          <TouchableOpacity
            style={styles.account}
            onPress={() => navigate(Routes.SIGNUP, {})}>
            <Text marginVertical="l" variant="subtitle">
              {t('appNamespace.noAccount')}
            </Text>
          </TouchableOpacity>

          <CustomButton
            action={handleSubmit(onLoginPress)}
            title={t('appNamespace.getIn')}
          />
        </Box>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const createStyles = (theme: ColorTheme) => {
  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: theme.mainBackground,
    },
    title: {
      color: theme.mainBackground,
      fontSize: getScreenHeight(2),
    },
    account: {
      alignSelf: 'center',
    },
  });
};

export default Login;
