import { IAddVideo, IPriority } from '../interface/IAdsVideo';
import axiosClient from '../api/AxiosClient';
import { ILoginInput } from '../interface/IAuth';
import { IResponse } from '../interface';
import {
  IFormChangeInstructionVideoStatus,
  TAddInstructionVideo,
  TInstructionVideoRes,
} from '../interface/TInstructionVideo';

const InstructionalVideoApi = {
  getAll() {
    const url = '/InstructionVideo/getAll';
    return axiosClient.get<IResponse<TInstructionVideoRes[]>>(url);
  },

  AddVideo(data: TAddInstructionVideo) {
    console.log('call :::', data);

    var bodyFormData = new FormData();

    bodyFormData.append('ProductType', data.ProductType);
    {
      data.VideoFile && bodyFormData.append('VideoFile', data.VideoFile);
    }

    const url = `/InstructionVideo/uploadInstructionVideo`;
    return axiosClient.post(url, bodyFormData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  delete(id: string) {
    const url = `/InstructionVideo/deleteInstructionVideo?id=${id}`;
    return axiosClient.delete(url);
  },
  changePaymentConfigStatus: async (videoId: string, status: number) => {
    const url = `/InstructionVideo/changeStatus?id=${videoId}&status=${status}`;
    return await axiosClient.put(url);
  },
};
export default InstructionalVideoApi;
