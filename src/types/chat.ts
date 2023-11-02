import {UserData} from './auth';

export type ChatItem = {
  _id: string;
  chatName: string;
  createdAt: string;
  groupAdmin: UserData[];
  users: UserData[];
  updatedAt: string;
  isGroupChat: boolean;
};

export type CreateGroupBody = {
  users: string[];
  name: string;
};
