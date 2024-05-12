import { UploadFile } from 'antd';
import axiosClient from '../api/AxiosClient';
import { TBanner } from '../interface/Tbanner';

const BannerKioskApi = {
  getAll() {
    const url = `/Product/banners`;
    return axiosClient.get(url);
  },
  addBannerKiosk(data: any | UploadFile[]) {
    //get File Blobs from UploadFile of antd
    const newData = data.map((file: UploadFile) => file.originFileObj);
    // console.log('call :::', data, newData);
    var bodyFormData = new FormData();
    newData.length > 0 &&
      newData.map((file: any, index: number) =>
        bodyFormData.append(`banners`, file)
      );
    const url = `/Product/addBanners`;
    // console.table([...bodyFormData]);
    return axiosClient.post(url, bodyFormData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  changePriorityBanners(data: Pick<TBanner, 'imageKey' | 'priority'>[]) {
    const url = `/Product/changePriorityBanners`;
    return axiosClient.post(url, data);
  },

  changeStatusBanners(imgKey: string, status: number) {
    const url = `/Product/changeStatusBanners?imgKey=${imgKey}&activeStatus=${status}`;
    return axiosClient.post(url);
  },
};

export default BannerKioskApi;
