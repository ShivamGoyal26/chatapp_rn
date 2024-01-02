import React, {memo} from 'react';
import dayjs from 'dayjs';
var relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);
import {useTranslation} from 'react-i18next';

// Files
import Box from '../Box';
import Text from '../Text';
import {getScreenHeight} from '../../utils/commonServices';
import {ChatItem as ChatItemProps} from '../../types/chat';

const ChatItem = ({
  chatName,
  isGroupChat,
  updatedAt,
  users,
  userId,
  latestMessage,
}: ChatItemProps & {userId: string | null | undefined}) => {
  const {t} = useTranslation();

  return (
    <Box flexDirection="row" alignItems="center" marginVertical="l">
      <Box
        borderRadius={getScreenHeight(100)}
        width={getScreenHeight(8)}
        height={getScreenHeight(8)}
        alignItems="center"
        justifyContent="center"
        borderColor="borderColor"
        borderWidth={getScreenHeight(0.1)}>
        <Text variant="heading">{'NA'}</Text>
      </Box>
      <Box marginLeft="m" flex={1}>
        <Text numberOfLines={1} variant="title">
          {isGroupChat
            ? chatName
            : users[0]._id === userId
            ? users[1].name
            : users[0].name}
        </Text>
        {isGroupChat ? (
          <Text numberOfLines={1} variant="subtitle">
            {users.length} {t('appNamespace.members')}
          </Text>
        ) : null}
        <Text numberOfLines={1} variant="subtitle">
          {latestMessage ? latestMessage.content : 'Start chatting...'}
        </Text>
        <Text numberOfLines={1} textAlign={'right'} variant="subtitle">
          {dayjs(updatedAt).fromNow()}
        </Text>
      </Box>
    </Box>
  );
};

export default memo(ChatItem);
