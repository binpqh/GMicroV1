import axiosClient from '../api/AxiosClient';
import { IPage } from '../interface/IPage';

import { IResponse } from '../interface/IResponse';
import { IGetAllCameraRes, TCamera } from '../interface/TCamera';

const CameraApi = {
  getAllVideos(deviceId: string, params: string) {
    console.log(deviceId, params);
    const url = `/Kiosk/getAllVideos?deviceId=${deviceId}&${params}`;
    return axiosClient.get<IGetAllCameraRes>(url);
  },
};
export default CameraApi;
