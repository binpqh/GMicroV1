import { IPage } from './IPage';

export type TCamera = {
  deviceId: string;
  videoKey: string;
  createdAt: string;
};
export interface IGetAllCameraRes {
  status: boolean;
  data: IPage<TCamera>;
}
