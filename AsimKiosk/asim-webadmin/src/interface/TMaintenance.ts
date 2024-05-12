import { StatusEnumString } from '../Constant/Status';
import { IPage } from './IPage';

export type TMaintenance = {
  // index?: string;
  groupId: string;
  id: string;
  deviceId: string;
  kioskName: string;
  assignee: string;
  note: string;
  logBy: string;
  deviceErrorCode: string;
  maintenanceState: string;
  status: StatusEnumString.Active | StatusEnumString.Inactive;
  createdAt: string;
};

export type TCreateMaintenance = {
  errorCode: 'string';
  deviceId: 'string';
  note: 'string';
};

export interface IGetAllTMaintenanceRes {
  status: boolean;
  data: IPage<TMaintenance>;
}
