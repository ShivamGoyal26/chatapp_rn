import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Keyboard,
  Platform,
  StatusBar,
  StyleSheet,
  TextInput,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useForm, Controller, SubmitHandler} from 'react-hook-form';
import {useTheme} from '@shopify/restyle';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

// Files
import {getScreenHeight} from '../../utils/commonServices';
import {AppDispatch} from '../../redux/store';
import {emailRegex} from '../../utils/regex';
import {ColorTheme, Theme} from '../../theme';
import {SignUpInputData} from '../../types/auth';
import {Images} from '../../constants';
import {
  Box,
  CustomButton,
  CustomHeader,
  CustomImage,
  CustomTextInput,
} from '../../components';
import {goBack} from '../../utils/routerServices';
import {registerThunk} from '../../redux/auth';
import axios from 'axios';
import {PickImageType} from '../../types/common';
import {uploadAssetsThunk} from '../../redux/assets';
import {UploadAssets} from '../../types/assets';

const SignUp = () => {
  const theme = useTheme<Theme>();
  const {colors} = theme;
  const {t} = useTranslation();
  const dispatch: AppDispatch = useDispatch();

  const styles = useMemo(() => createStyles(colors), [colors]);
  const nameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const cancelToken = useRef<any>();

  const [secure, setSecure] = useState(true);
  const [image, setImage] = useState<PickImageType | null>(null);

  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(colors.mainBackground);
      StatusBar.setBarStyle('dark-content');
    }

    return () => {
      if (cancelToken?.current) {
        cancelToken?.current('Cancelled');
      }
    };
  }, [colors?.mainBackground]);

  const pickImage = (imageData: PickImageType) => {
    setImage(imageData);
  };

  const {
    control,
    handleSubmit,
    formState: {errors},
    trigger,
  } = useForm<SignUpInputData>();

  const onSignUpPress: SubmitHandler<SignUpInputData> = async data => {
    const {cancel, token} = axios.CancelToken.source();
    cancelToken.current = cancel;
    if (image) {
      let uploadAssetProps: UploadAssets = {
        filename: `${image?.fileName}`,
        contentType: image?.type,
        imageData: image,
        ...data,
        cancelToken: token,
      };
      return dispatch(uploadAssetsThunk(uploadAssetProps));
    }
    dispatch(registerThunk({...data, cancelToken: token}));
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <CustomHeader
        leftIconColor={colors.mainForeground}
        leftAction={goBack}
        leftIcon={Images.back}
        title={t('appNamespace.signUp')}
      />

      <KeyboardAwareScrollView
        bounces={false}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        enableAutomaticScroll={Platform.OS === 'ios'}
        contentContainerStyle={{flexGrow: 1}}>
        <Box margin="s" flex={1} backgroundColor="mainBackground">
          <Box mb="l" alignSelf="center">
            <CustomImage uri={image?.uri} action={pickImage} />
          </Box>

          <Box marginBottom="m">
            <Controller
              name="name"
              control={control}
              rules={{
                required: t('messagesNamespace.nameRequired'),
              }}
              defaultValue="shivam"
              render={({field}) => (
                <CustomTextInput
                  inputRef={nameRef}
                  label={t('appNamespace.nameTitle')}
                  onChangeText={field.onChange}
                  value={field.value}
                  placeholder={t('appNamespace.name')}
                  onBlur={() => trigger('name')}
                  error={errors.name?.message}
                  type="next"
                  onSubmit={() => {
                    emailRef.current?.focus();
                  }}
                />
              )}
            />
          </Box>

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
                  keyboardType="email-address"
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

          <Box marginBottom="l">
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
                  rightTint={colors.mainForeground}
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
                    handleSubmit(onSignUpPress);
                  }}
                />
              )}
            />
          </Box>

          <CustomButton
            action={handleSubmit(onSignUpPress)}
            title={t('appNamespace.create')}
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
  });
};

export default SignUp;
