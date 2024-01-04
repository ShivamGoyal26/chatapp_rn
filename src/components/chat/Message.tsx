import React, {memo} from 'react';
import dayjs from 'dayjs';
var relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);
import {useSelector} from 'react-redux';

// Files
import Text from '../Text';
import {MessageItem} from '../../redux/chat';
import {RootState} from '../../redux/store';
import Box from '../Box';
import {getScreenHeight, getScreenWidth} from '../../utils/commonServices';

const Message = ({item}: {item: MessageItem}) => {
  const userData = useSelector((state: RootState) => state.auth.userData);

  return (
    <Box
      alignSelf={item.sender._id === userData?.id ? 'flex-end' : 'flex-start'}
      padding={'l'}
      flexDirection={'row'}
      maxWidth={getScreenWidth(80)}>
      <Box
        height={getScreenHeight(4)}
        width={getScreenHeight(4)}
        borderColor={'borderColor'}
        borderWidth={1}
        justifyContent={'center'}
        alignItems={'center'}
        marginRight={'m'}
        borderRadius={getScreenHeight(100)}>
        <Text variant={'subtitle'}>{item.sender.name[0]}</Text>
      </Box>
      <Box
        alignItems={
          item.sender._id === userData?.id ? 'flex-end' : 'flex-start'
        }>
        <Text variant={'title'}>{item.content}</Text>
        <Text variant={'error'} color={'borderColor'}>
          {dayjs(item.createdAt).format('D-M-YY hh:mm a')}
        </Text>
        <Text
          textDecorationStyle={'dashed'}
          variant={'error'}
          color={'success'}>
          sent by: {item.sender.name}
        </Text>
      </Box>
    </Box>
  );
};

export default memo(Message);
