import { IPage } from './IPage';

export type TKioskLog = {
  deviceId: string;
  kioskName: string;
  groupName: string;
  numberOfLogs: number;
};

export type TKioskDetailLog = {
  type: string;
  urlAPI: string;
  jsonData: string;
  desc: string;
  createdAt: string;
};

export type TKioskLogAllRes = {
  success: boolean;
  data: IPage<TKioskLog>;
};
export type TKioskLogRes = {
  success: boolean;
  data: IPage<TKioskDetailLog>;
};
