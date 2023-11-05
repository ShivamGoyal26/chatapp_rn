import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@shopify/restyle';
import {useFocusEffect} from '@react-navigation/native';

// Files
import {getScreenHeight} from '../../utils/commonServices';
import {ColorTheme, Theme} from '../../theme';
import {Box, ChatItem, CustomHeader, Text} from '../../components';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import {getUserChatsThunk} from '../../redux/chat';
import {ChatItem as ChatItemProps} from '../../types/chat';
import images from '../../constants/images';
import {navigate} from '../../utils/routerServices';
import {Routes} from '../../constants';
import {UserDataFromServer} from '../../types/auth';

const RenderItem = ({name, email, pic}: UserDataFromServer) => {
  return (
    <Box
      flex={1}
      flexDirection={'row'}
      marginBottom={'l'}
      alignItems={'center'}>
      <Box
        height={getScreenHeight(9)}
        width={getScreenHeight(9)}
        borderRadius={getScreenHeight(100)}
        borderColor={'borderColor'}
        borderWidth={getScreenHeight(0.1)}
        justifyContent={'center'}
        marginRight={'m'}
        alignItems={'center'}>
        <Text variant={'heading'}>{name[0]}</Text>
      </Box>
      <Text variant={'title'}>{name}</Text>
    </Box>
  );
};

const GroupInfo = ({route}: any) => {
  const data: ChatItemProps = route.params.data;

  console.log(data.users);

  const theme = useTheme<Theme>();
  const {colors} = theme;
  const {t} = useTranslation();

  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <CustomHeader
        rightAction={() => navigate(Routes.CREATE_GROUP, {})}
        rightIcon={images.plus}
        title={data.chatName}
      />

      <Box margin="s" flex={1} backgroundColor="mainBackground">
        <FlatList
          data={data.users}
          keyExtractor={item => item._id}
          renderItem={({item}) => <RenderItem {...item} />}
        />
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
  });
};

export default GroupInfo;
