import React, {memo} from 'react';
import dayjs from 'dayjs';
import {useTranslation} from 'react-i18next';
import {StyleSheet, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';

// Files
import Box from '../Box';
import Text from '../Text';
import {getScreenHeight} from '../../utils/commonServices';
import {SelectUserData} from '../../types/auth';
import {Images} from '../../constants';

type SelectUserItemProps = SelectUserData & {
  onPress: (id: number) => void;
};

const SelectUserItem = ({
  name,
  createdAt,
  onPress,
  _id,
  index,
  isSelected,
  isDisabled,
}: SelectUserItemProps & {index: number}) => {
  const {t} = useTranslation();

  console.log('SelectUserItemProps');

  return (
    <TouchableOpacity
      disabled={isDisabled}
      style={{opacity: isDisabled ? 0.5 : 1}}
      onPress={() => onPress(index)}>
      <Box
        flexDirection="row"
        justifyContent={'space-between'}
        alignItems="center"
        marginVertical="l">
        <Box flex={1} flexDirection={'row'} alignItems={'center'}>
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

        {isSelected ? (
          <FastImage
            source={Images.check}
            resizeMode="contain"
            style={styles.icon}
          />
        ) : null}
      </Box>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  icon: {
    height: getScreenHeight(2),
    width: getScreenHeight(2),
  },
});

export default memo(SelectUserItem);
