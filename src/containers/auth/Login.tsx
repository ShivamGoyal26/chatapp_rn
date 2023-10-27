import React, {useEffect, useMemo, useRef} from 'react';
import {
  Button,
  Keyboard,
  Platform,
  StatusBar,
  StyleSheet,
  TextInput,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useForm, Controller, SubmitHandler} from 'react-hook-form';
import {useTheme} from '@shopify/restyle';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

// Files
import {getScreenHeight} from '../../utils/commonServices';
import {AppDispatch, RootState} from '../../redux/store';
import {emailRegex} from '../../utils/regex';
import CustomTextInput from '../../components/CustomTextInput';
import Box from '../../components/Box';
import {ColorTheme, Theme} from '../../theme';
import Text from '../../components/Text';
import {getUserDataThunk} from '../../redux/auth';
import {LoginInputData} from '../../types/auth';

const Login = () => {
  const theme = useTheme<Theme>();
  const {colors} = theme;
  const {t} = useTranslation();
  const userData = useSelector((state: RootState) => state.auth.userData);
  const dispatch: AppDispatch = useDispatch();

  const styles = useMemo(() => createStyles(colors), [colors]);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(colors.mainBackground);
      StatusBar.setBarStyle('dark-content');
    }
  }, [colors?.mainBackground]);

  const {
    control,
    handleSubmit,
    formState: {errors},
    trigger,
  } = useForm<LoginInputData>();

  const onLoginPress: SubmitHandler<LoginInputData> = async data => {
    const res = await dispatch(getUserDataThunk(data));
    console.log(res);
    console.log(userData);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Text m="s" marginBottom="l" variant="heading">
        {t('appNamespace.login')}
      </Text>
      <KeyboardAwareScrollView
        bounces={false}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        enableAutomaticScroll={Platform.OS === 'ios'}
        contentContainerStyle={{flexGrow: 1}}>
        <Box margin="s" flex={1} backgroundColor="mainBackground">
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
              defaultValue=""
              render={({field}) => (
                <CustomTextInput
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
              defaultValue=""
              render={({field}) => (
                <CustomTextInput
                  secure={true}
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

          <Button title="Login" onPress={handleSubmit(onLoginPress)} />
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
  });
};

export default Login;
