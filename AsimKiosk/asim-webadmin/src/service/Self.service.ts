import axiosClient from "../api/AxiosClient";
import { IUpdatePasswordSelf } from "../interface/ISelf";

const SelfAPI = {
  getMe() {
    const url = "/auth/self";
    return axiosClient.get(url);
  },
  updateSelfPassword(data: IUpdatePasswordSelf) {
    const url = "/account/self/password";
    return axiosClient.put(url, data);
  },
};
export default SelfAPI;
