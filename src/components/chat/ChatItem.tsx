import React, {memo, useCallback, useEffect, useState} from 'react';
import dayjs from 'dayjs';
var relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);
import {useTranslation} from 'react-i18next';

// Files
import Box from '../Box';
import Text from '../Text';
import {getScreenHeight} from '../../utils/commonServices';
import {ChatItem as ChatItemProps} from '../../types/chat';
import {getAssetsThunk} from '../../redux/assets';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../redux/store';
import CustomImage from '../common/CustomImage';

const ChatItem = ({
  chatName,
  isGroupChat,
  updatedAt,
  users,
  userId,
  latestMessage,
}: ChatItemProps & {userId: string | null | undefined}) => {
  const {t} = useTranslation();

  const userDetails = users[0]._id === userId ? users[1] : users[0];
  const [pic, setPic] = useState<null | string | undefined>(null);

  const dispatch: AppDispatch = useDispatch();

  const getUserPic = useCallback(
    async (key: string) => {
      if (key) {
        const res = await dispatch(getAssetsThunk(key));
        if (res.meta.requestStatus === 'fulfilled') {
          setPic(res.payload as string | null | undefined);
        }
      }
    },
    [dispatch],
  );

  useEffect(() => {
    if (userDetails?.pic) {
      getUserPic(userDetails?.pic);
    }
  }, [getUserPic, userDetails?.pic]);

  return (
    <Box flexDirection="row" alignItems="center" marginVertical="l">
      {userDetails.pic ? (
        <Box my="l" alignSelf="center">
          <CustomImage
            height={getScreenHeight(8)}
            width={getScreenHeight(8)}
            uri={pic}
            disabled={true}
          />
        </Box>
      ) : (
        <Box
          borderRadius={getScreenHeight(100)}
          width={getScreenHeight(8)}
          height={getScreenHeight(8)}
          alignItems="center"
          justifyContent="center"
          borderColor="borderColor"
          borderWidth={getScreenHeight(0.1)}>
          <Text variant="heading">{userDetails.name[0]}</Text>
        </Box>
      )}

      <Box marginLeft="m" flex={1}>
        <Text numberOfLines={1} variant="title">
          {isGroupChat ? chatName : userDetails.name}
        </Text>
        {isGroupChat ? (
          <Text numberOfLines={1} variant="subtitle">
            {users.length} {t('appNamespace.members')}
          </Text>
        ) : null}
        {latestMessage ? (
          <Text numberOfLines={1} variant="subtitle">
            {latestMessage?.sender?._id === userId
              ? 'You'
              : latestMessage?.sender?.name}
            {': '}
            {latestMessage ? latestMessage.content : 'Start chatting...'}
          </Text>
        ) : (
          <Text numberOfLines={1} variant="subtitle">
            'Start chatting...
          </Text>
        )}
        <Text numberOfLines={1} textAlign={'right'} variant="subtitle">
          {dayjs(updatedAt).fromNow()}
        </Text>
      </Box>
    </Box>
  );
};

export default memo(ChatItem);
