import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Keyboard,
  Platform,
  StatusBar,
  StyleSheet,
  TextInput,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@shopify/restyle';

// Files
import {getScreenHeight} from '../../utils/commonServices';
import {ColorTheme, Theme} from '../../theme';
import {
  Box,
  CustomButton,
  CustomHeader,
  CustomTextInput,
  SelectUsers,
} from '../../components';

import {Images} from '../../constants';
import {goBack} from '../../utils/routerServices';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../redux/store';
import {SelectUserData} from '../../types/auth';
import {createGroupThunk} from '../../redux/chat';

const CreateGroup = () => {
  const theme = useTheme<Theme>();
  const {colors} = theme;
  const dispatch = useDispatch<AppDispatch>();
  const {t} = useTranslation();
  const nameRef = useRef<TextInput>(null);
  const selectedUsers = useRef<any>();

  const styles = useMemo(() => createStyles(colors), [colors]);

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
  } = useForm<{name: string}>();

  const onCreateGroupPress: SubmitHandler<{name: string}> = async data => {
    let finalData = {
      name: data.name,
      users: selectedUsers.current
        .getSelectedItem()
        ?.map((item: SelectUserData) => item._id),
    };

    dispatch(createGroupThunk(finalData));
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <CustomHeader
        leftIcon={Images.back}
        leftAction={goBack}
        leftIconColor={colors.mainForeground}
        title={t('appNamespace.createGroup')}
      />
      <Box flex={1} marginHorizontal={'m'} backgroundColor={'mainBackground'}>
        <Box marginBottom="m">
          <Controller
            name="name"
            control={control}
            rules={{
              required: t('messagesNamespace.nameRequired'),
            }}
            defaultValue=""
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
                  Keyboard.dismiss();
                }}
              />
            )}
          />
        </Box>
        <SelectUsers ref={selectedUsers} />
        <Box marginVertical="l">
          <CustomButton
            action={handleSubmit(onCreateGroupPress)}
            title={t('appNamespace.create')}
          />
        </Box>
      </Box>
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

export default CreateGroup;
