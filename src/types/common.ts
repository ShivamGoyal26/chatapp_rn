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
