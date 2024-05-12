import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { useContext } from 'react';

import { toast } from 'react-toastify';
import { logout, refreshToken } from '../apps/Feature/authSlice/authSlice';
import { setForbidden } from '../apps/Feature/Forbiden403/forbidenSlice';

const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api`,
  headers: {
    'Content-type': 'application/json',
    MyCustomHeader1: '1',
  },
  withCredentials: false,
});

export const setupInterceptors = (store: any) => {
  axiosClient.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (err: any) => {
      const originalConfig = err.config;
      // console.log("resfetching token");

      if (originalConfig.url !== '/auth/login' && err.response) {
        // Access Token was expired
        // console.log("refreshToken");
        if (err.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;
          try {
            const localToken = sessionStorage.getItem('token');
            const res = await axiosClient.post(
              `/Authentication/refreshToken?token=${localToken}`,
              null
            );
            // console.log('::::::', res, res.data);
            store.dispatch(refreshToken(res.data));

            return axiosClient(originalConfig);
          } catch (_error) {
            console.log("refreshTokenError",_error)
            store.dispatch(logout());
            // window.location.href = '/login';
            return Promise.reject(_error);
          }
        }
      }
      // console.log("end refresh");
      console.log('ERROR RESPONSE:', err.response);
      const { data, status } = err.response;

      if (status === 403) {
        store.dispatch(setForbidden(true));
        return Promise.reject({ data, status });
      }
      return Promise.reject(data);
    }
  );
};

axiosClient.interceptors.request.use(
  (config: any) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`,
      };
    }

    // console.log({ config });
    return config;
  },
  (error) => {
    console.log('ERROR RESPONSE:', error.response);
    return Promise.reject(error);
  }
);

export default axiosClient;
