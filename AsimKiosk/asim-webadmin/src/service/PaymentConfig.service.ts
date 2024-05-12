import axiosClient from '../api/AxiosClient';
import { IResponse } from '../interface';
import {
  IFormChangePaymentConfigStatus,
  IFormCreatePaymentConfig,
  IPaymentConfig,
} from '../interface/IPaymentConfig';

export const PaymentConfigApi = {
  createPaymentConfig: async (dataCreate: IFormCreatePaymentConfig) => {
    const formatData = {
      keySecret: dataCreate.keySecret,
      merchantCode: dataCreate.merchantCode,
      channelCode: dataCreate.channelCode,
      domainUrl: {
        paymentConfig: dataCreate.paymentConfig,
        paymentGateway: dataCreate.paymentGateway,
      },
      customerEmail: dataCreate.customerEmail,
      customerName: dataCreate.customerName,
      customerMobile: dataCreate.customerMobile,
      ipnUrl: dataCreate.ipnUrl,
      redirectUrl: dataCreate.redirectUrl,
      shopId: dataCreate.shopId,
    };
    const url = `/ConfigurePayment/add`;
    const res = await axiosClient.post(url, formatData);
    return res.data;
  },
  updatePaymentConfig: async (id: string, dataCreate: IFormCreatePaymentConfig) => {
    const formatData = {
      id: id,
      keySecret: dataCreate.keySecret,
      merchantCode: dataCreate.merchantCode,
      channelCode: dataCreate.channelCode,
      domainUrl: {
        paymentConfig: dataCreate.paymentConfig,
        paymentGateway: dataCreate.paymentGateway,
      },
      customerEmail: dataCreate.customerEmail,
      customerName: dataCreate.customerName,
      customerMobile: dataCreate.customerMobile,
      ipnUrl: dataCreate.ipnUrl,
      redirectUrl: dataCreate.redirectUrl,
      shopId: dataCreate.shopId,
    };
    const url = `/ConfigurePayment/update`;
    const res = await axiosClient.post(url, formatData);
    return res.data;
  },

  changePaymentConfigStatus: async (dataUpdate: IFormChangePaymentConfigStatus) => {
    const url = `/ConfigurePayment/changeStatus`;
    const res = await axiosClient.post(url, dataUpdate);
    return res.data;
  },
  getAllPaymentConfig: async () => {
    const url = `/ConfigurePayment/getAll`;
    const res = await axiosClient.get<IResponse<IPaymentConfig[]>>(url);
    return res.data;
  },
};
