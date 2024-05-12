import axiosClient from "../api/AxiosClient";

const ChartsAPI = {
  getChartAll(params: string) {
    const url = `/payment/report/stat/all?${params}`;
    return axiosClient.get(url);
  },
  getChartDays(params: string) {
    const url = `payment/report/stat/days?${params}`;
    return axiosClient.get(url);
  },
};
export default ChartsAPI;
