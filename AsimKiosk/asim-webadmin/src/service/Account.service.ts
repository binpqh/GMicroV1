import axiosClient from '../api/AxiosClient';
import {
  IAccount,
  IFormAccount,
  IGetAllAccountRes,
  IFormUpdateAccount,
  IFormUpdateAccountRole,
  IFormUpdatePassword,
  IFormUpdateAccountStatus,
} from '../interface';
import { IResponse } from '../interface/IResponse';

const AccountApi = {
  async getAllAccounts(params: string) {
    const url = `/User/getAll?${params}`;
    const res = await axiosClient.get<IGetAllAccountRes>(url);
    return res.data;
  },
  async getAccountById(userId: string) {
    const url = `/User?userId=${userId}`;
    const res = await axiosClient.get<IResponse<IAccount>>(url);
    return res.data;
  },
  async createNewAccounts(dataCreate: IFormAccount) {
    const url = '/Authentication/register';
    const res = await axiosClient.post(url, dataCreate);
    return res.data;
  },
  async updateAccount(dataUpdate: IFormUpdateAccount) {
    const url = `/user/update`;
    const data = await axiosClient.post(url, dataUpdate);
    return data.data;
  },
  async updateAccountPassword(dataChangePassword: IFormUpdatePassword) {
    const url = `/User/changePassword`;
    const res = await axiosClient.post(url, dataChangePassword);
    return res.data;
  },
  async updateAccountRole(dataUpdate: IFormUpdateAccountRole) {
    const url = `/User/changeRole`;
    const data = await axiosClient.post(url, dataUpdate);
    return data.data;
  },
  async updateStatusAccount(dataUpdate: IFormUpdateAccountStatus) {
    const url = `/User/changeStatus`;
    const data = await axiosClient.post(url, dataUpdate);
    return data.data;
  },
};
export default AccountApi;
