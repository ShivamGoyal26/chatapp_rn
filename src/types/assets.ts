import {PickImageType} from './common';

export type UploadAssets = {
  filename: string | undefined;
  contentType: string | undefined;
  imageData: PickImageType | undefined | null;
  cancelToken: any;
  email: string;
  password: string;
  name: string;
};
