import axiosClient from '../api/AxiosClient';

import queryString from 'query-string';
import {
  IGetAllTMaintenanceRes,
  IResponse,
  TReportFilter,
  TResOrderCode,
  TResOrderSearch,
} from '../interface';
const ReportApi = {
  getReport(filter: TReportFilter) {
    const { page, pageSize, ...bodyData } = filter;
    // console.log('bodyData', bodyData, filter);
    const params = {
      page: page,
      pageSize: pageSize,
    };

    const url = `/Report/getOrderReport`;
    return axiosClient.post<IGetAllTMaintenanceRes>(url, bodyData, { params: params });
  },

  getDetailOrder(orderCode: string) {
    const url = `/Order/get?orderCode=${orderCode}`;
    return axiosClient.get<IResponse<TResOrderCode>>(url);
  },
  getFind(value: string, numberGet: number = 0) {
    const url = `/Order/search?queryString=${value}&number=${numberGet}`;
    return axiosClient.get<IResponse<TResOrderSearch[]>>(url);
  },
};
export default ReportApi;
