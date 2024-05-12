import axiosClient from '../api/AxiosClient';
import { IResponse, TKioskLogAllRes, TKioskLogRes } from '../interface';

const LogApi = {
  getAllKioskLog(params: { page: number; pageSize: number }) {
    const url = `/Log/kiosk-log`;
    return axiosClient.get<TKioskLogAllRes>(url, { params: params });
  },
  getKioskLog(params: {
    page: number;
    pageSize: number;
    from: string;
    to: string;
    deviceId: string;
  }) {
    const url = `/Log/paginate`;
    return axiosClient.get<TKioskLogRes>(url, { params: params });
  },
};

export default LogApi;
