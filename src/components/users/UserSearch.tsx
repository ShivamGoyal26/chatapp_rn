import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';

// Files
import Box from '../Box';
import CustomTextInput from '../CustomTextInput';
import {useDebounce} from '../../hooks';

type UserSearchProps = {
  action: (keyword: string) => void;
};

const UserSearch = ({action}: UserSearchProps) => {
  const {t} = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedValue = useDebounce(searchQuery, 500);

  useEffect(() => {
    action(debouncedValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  return (
    <Box mb="m">
      <CustomTextInput
        placeholder={t('appNamespace.search')}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
    </Box>
  );
};

export default UserSearch;
