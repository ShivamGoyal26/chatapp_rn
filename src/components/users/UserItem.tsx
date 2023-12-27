import React, {memo} from 'react';
import dayjs from 'dayjs';
import {useTranslation} from 'react-i18next';

// Files
import Box from '../Box';
import Text from '../Text';
import {SearchedUser} from '../../types/common';
import {getScreenHeight} from '../../utils/commonServices';
import {TouchableOpacity} from 'react-native';

const UserItem = ({
  name,
  createdAt,
  _id,
  action,
}: SearchedUser & {action?: (params: string) => void}) => {
  const {t} = useTranslation();
  return (
    <TouchableOpacity
      onPress={() => {
        if (action) {
          action(_id);
        }
      }}
      disabled={!action}>
      <Box flexDirection="row" alignItems="center" marginVertical="l">
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
            {t('appNamespace.joinedAt')}:{' '}
            {dayjs(createdAt).format('DD-MMM-YYYY')}
          </Text>
        </Box>
      </Box>
    </TouchableOpacity>
  );
};

export default memo(UserItem);
