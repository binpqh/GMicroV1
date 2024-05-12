import axiosClient from "../api/AxiosClient";

const PartnerApi = {
  async clearCache() {
    const url = `partner/clean-cache`;
    return axiosClient.post(url);
  },
};

export default PartnerApi;
