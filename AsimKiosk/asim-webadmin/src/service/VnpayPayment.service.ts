import { IAddVnpayMerchant, IAddVnpayTerminal } from "./../interface";
import axiosClient from "../api/AxiosClient";

const VnpayPaymentApi = {
  getAllMerchant() {
    const url = "/vnpay-profile/merchant";
    return axiosClient.get(url);
  },
  getProfile() {
    const url = "/vnpay-profile/profile";
    return axiosClient.get(url);
  },
  getMerchantTerminal(id: number) {
    const url = `/vnpay-profile/merchant/terminal?merchantId=${id}`;
    return axiosClient.get(url);
  },

  addMerchant(data: IAddVnpayMerchant) {
    const url = "/vnpay-profile/merchant";
    return axiosClient.post(url, data);
  },

  addTerminal(data: IAddVnpayTerminal) {
    const url = "/vnpay-profile/terminal";
    return axiosClient.post(url, data);
  },
  useTerminal(id: number) {
    const url = `/vnpay-profile/use-terminal?terminalId=${id}`;
    return axiosClient.patch(url);
  },
};

export default VnpayPaymentApi;
