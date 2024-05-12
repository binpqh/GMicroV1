import axiosClient from "../api/AxiosClient";
import { ILoginInput } from "../interface/IAuth";

export const LoginAsync = async (data: ILoginInput) => {
  // console.log(data);
  const response = await axiosClient.post("/Authentication/login", data);
  return response.data;
};

export const GetMeAsync = async () => {
  const res = await axiosClient.get("/seller/get-me");
  return res.data;
};
