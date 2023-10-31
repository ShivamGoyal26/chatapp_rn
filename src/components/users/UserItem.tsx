import {useTheme} from '@shopify/restyle';
import React, {memo, useEffect, useMemo, useState} from 'react';
import {StyleSheet} from 'react-native';

// Files
import {ColorTheme, Theme} from '../../theme';
import Box from '../Box';
import {useTranslation} from 'react-i18next';
import Text from '../Text';
import {SearchedUser} from '../../types/common';
import dayjs from 'dayjs';
import {getScreenHeight} from '../../utils/commonServices';

const UserItem = ({name, createdAt}: SearchedUser) => {
  const {t} = useTranslation();
  return (
    <Box flexDirection="row" marginVertical="l">
      <Box
        borderRadius={getScreenHeight(100)}
        width={getScreenHeight(8)}
        height={getScreenHeight(8)}
        alignItems="center"
        justifyContent="center"
        borderColor="borderColor"
        borderWidth={getScreenHeight(0.1)}>
        <Text variant="heading">{name[0]}</Text>
      </Box>
      <Box marginLeft="m" flex={1}>
        <Text numberOfLines={1} variant="title">
          {name}
        </Text>
        <Text numberOfLines={1} variant="subtitle">
          {t('appNamespace.joinedAt')}: {dayjs(createdAt).format('DD-MMM-YYYY')}
        </Text>
      </Box>
    </Box>
  );
};

export default memo(UserItem);
