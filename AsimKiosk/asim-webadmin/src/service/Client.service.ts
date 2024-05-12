import { StatusEnum } from '../Constant/Status';
import axiosClient from '../api/AxiosClient';
import {
  TDetailKiosk,
  IResponse,
  TGroupKioskListDropDown,
  TKioskListDropDown,
  TLogPeripheral,
} from '../interface';
import { TGroup } from '../interface/IGroup';

const ClientApi = {
  getAll() {
    const url = `/Kiosk/getAll`;
    return axiosClient.get(url);
  },

  getKioskDropDown() {
    const url = `/Kiosk/dropDown`;
    return axiosClient.get<IResponse<TKioskListDropDown[]>>(url);
  },

  getGroupKioskDropdown() {
    const url = `/Kiosk/groupKioskDropdown`;
    return axiosClient.get<IResponse<TGroupKioskListDropDown[]>>(url);
  },

  getKioskById(id: string) {
    const url = `/Kiosk/getByDeviceId?deviceId=${id}`;
    return axiosClient.get(url);
  },

  getKioskByGroupId(id: string, param: string) {
    const url = `/Kiosk/getKioskByGroupId?groupId=${id}&${param}`;
    return axiosClient.get(url);
  },

  getKioskLog(id: string, params: string) {
    const url = `/kiosk/log/${id}?${params}`;
    return axiosClient.get(url);
  },

  update(
    id: string,
    data: Pick<TDetailKiosk, 'posCodeTerminal' | 'groupName' | 'name' | 'address'>
  ) {
    const url = `/Kiosk/updateDetails?deviceId=${id}`;
    return axiosClient.patch(url, data);
  },

  delete(id: string) {
    const url = `/kiosk/${id}`;
    return axiosClient.delete(url);
  },

  deleteConnection(id: string) {
    const url = `/kiosk/${id}`;
    return axiosClient.patch(url);
  },
  changeStatusKiosk(id: string, status: number) {
    // console.log(status, status === StatusEnum.Active);
    const url =
      status === StatusEnum.Active
        ? `/Kiosk/activeKiosk?deviceId=${id}`
        : `/Kiosk/inactiveKiosk?deviceId=${id}`;

    return axiosClient.put(url);
  },
  changeStatusPeripheral(peripheralId: string, status: number, deviceId: string) {
    const url = `/Kiosk/changePeripheralStatus?deviceId=${deviceId}&peripheralId=${peripheralId}&status=${status}`;
    return axiosClient.patch(url);
  },
  refreshKiosk(deviceId: string) {
    const url = `/Kiosk/refreshKiosk?deviceId=${deviceId}`;
    return axiosClient.get(url);
  },
  OpenLocker(deviceId: string) {
    const url = `Kiosk/openLockKiosk?deviceId=${deviceId}`;
    return axiosClient.post(url);
  },

  updatePeripheral(
    peripheralId: string,
    deviceId: string,
    data: {
      productCode?: string;
      itemCode?: string;
      path: string;
    }
  ) {
    const url = `Kiosk/updatePeripheral?peripheralId=${peripheralId}&deviceId=${deviceId}`;
    return axiosClient.patch(url, data);
  },

  getPeripheralLog(deviceId: string, logType: string) {
    const url = `/LogPeripherals/getAllById?deviceId=${deviceId}&logType=${logType}`;
    return axiosClient.get<IResponse<TLogPeripheral[]>>(url);
  },

  async approveKioskAsync(deviceId: string) {
    const url = `/kiosk/approveKiosk?deviceId=${deviceId}`;
    return await axiosClient.post(url);
  },

  async updateKioskAsync(deviceId: string, params: any) {
    const url = `/kiosk/updateDetails?deviceId=${deviceId}`;
    return await axiosClient.patch(url, {});
  },
};

export default ClientApi;
