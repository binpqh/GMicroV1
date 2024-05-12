import axiosClient from '../api/AxiosClient';
import { IResponse } from '../interface';

import { TFromLocalSimConfig, TLocalSimConfig } from '../interface/TLocalSimApi';

export const LocalSimApi = {
  getAllLocalSimConfig() {
    const url = `/LocalSimConfig/getAllConfig`;
    return axiosClient.get<IResponse<TLocalSimConfig[]>>(url);
  },
  getLocalSimConfigById(id: string) {
    const url = `/LocalSimConfig/getById?id=${id}`;
    return axiosClient.get(url);
  },
  createLocalSimConfig(data: TFromLocalSimConfig) {
    const url = `/LocalSimConfig/create`;
    return axiosClient.post(url, data);
  },
  updateLocalSimConfig(id: string, data: TFromLocalSimConfig) {
    const url = `/LocalSimConfig/update?id=${id}`;
    return axiosClient.patch(url, data);
  },
  ActiveLocalSimConfig(id: string) {
    const url = `/LocalSimConfig/active?id=${id}`;
    return axiosClient.patch(url);
  },
  DeleteLocalSimConfig(id: string) {
    const url = `/LocalSimConfig/delete?id=${id}`;
    return axiosClient.delete(url);
  },
};
