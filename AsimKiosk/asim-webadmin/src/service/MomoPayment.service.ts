import axiosClient from "../api/AxiosClient";
import { IAddMomoPartner } from "../interface";

const MomoPaymentApi = {
  getAllPartner() {
    const url = "momo-profile/partner-gateway";
    return axiosClient.get(url);
  },
  getProfile() {
    const url = "/momo-profile/partner-gateway/profile";
    return axiosClient.get(url);
  },

  addPartner(data: IAddMomoPartner) {
    const url = "/momo-profile/partner-gateway";
    return axiosClient.post(url, data);
  },
  usePartner(id: number) {
    const url = `momo-profile/partner-gateway/use/${id}`;
    return axiosClient.patch(url);
  },
};

export default MomoPaymentApi;
