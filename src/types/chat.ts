import {UserDataFromServer} from './auth';

export type ChatItem = {
  _id: string;
  chatName: string;
  createdAt: string;
  groupAdmin: UserDataFromServer[];
  users: UserDataFromServer[];
  updatedAt: string;
  isGroupChat: boolean;
};

export type CreateGroupBody = {
  users: string[];
  name: string;
};

export type RemoveUserFromGroupAPIBodyData = {
  chatId: string | null | undefined;
  userId: string | null | undefined;
};

export type AddUsersGroupAPIBodyData = {
  chatId: string | null | undefined;
  userIds: string | null | undefined;
};
