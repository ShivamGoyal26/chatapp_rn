export type PickImageType = {
  fileName: string;
  fileSize: number;
  height: number;
  width: number;
  type: string;
  uri: string;
};

export type SearchUsersRequestData = {
  page: number;
  limit: number;
  search: string;
};

export type SearchedUser = {
  _id: string;
  createdAt: string;
  name: string;
  updatedAt: string;
  pic: string | null;
};

export type PageProps = {
  limit: number;
  page: number;
};
