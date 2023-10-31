import {useTheme} from '@shopify/restyle';
import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet} from 'react-native';

// Files
import {ColorTheme, Theme} from '../../theme';
import Box from '../Box';
import CustomTextInput from '../CustomTextInput';
import {useTranslation} from 'react-i18next';
import {useAssetAccess, useDebounce} from '../../hooks';

type UserSearchProps = {
  action: (keyword: string) => void;
};

const UserSearch = ({action}: UserSearchProps) => {
  const theme = useTheme<Theme>();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(colors), [colors]);
  const {t} = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedValue = useDebounce(searchQuery, 500);

  useEffect(() => {
    action(debouncedValue);
  }, [action, debouncedValue]);

  return (
    <Box>
      <CustomTextInput
        placeholder={t('appNamespace.search')}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
    </Box>
  );
};

const createStyles = (theme: ColorTheme) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: theme.mainBackground,
    },
    screen: {
      flex: 1,
      backgroundColor: theme.mainBackground,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default UserSearch;
