import {PickImageType} from './common';

export type UploadAssets = {
  filename: string | undefined;
  contentType: string | undefined;
  imageData: PickImageType | undefined | null;
};
