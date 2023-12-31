import {SearchedUser} from './common';

export type LoginInputData = {
  email: string;
  password: string;
};

export type SignUpInputData = {
  name: string;
  email: string;
  password: string;
  cancelToken: any;
  key?: string;
};

export type UserData = {
  name: string;
  email: string;
  pic: string;
  token: string;
  id: string;
};

export type UserDataFromServer = {
  name: string;
  pic: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
};

export type SelectUserData = SearchedUser & {
  isSelected: boolean;
  isDisabled: boolean;
};
