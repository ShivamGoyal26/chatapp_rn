import {UserData, UserDataFromServer} from './auth';

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

export type DeleteGroupAPIBodyData = {
  chatId: string;
  userId: string;
};
