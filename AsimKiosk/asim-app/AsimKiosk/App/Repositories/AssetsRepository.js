import ServiceEnum from './../Variables/ServiceEnum';
import { Constants } from '../Config';
import { uploadVideo, getData } from '../Services/network/network-services';
class AssetsRepository {
    constructor() {
    }

    async getAssets() {
        const data = await getData(Constants.SERVER_URL_USER + ServiceEnum.ASSETS);
        return data;
    }
    async uploadVideo(uri, videoName) {
        const data = await uploadVideo(uri, videoName);
        return data;
    }
}

export default AssetsRepository;