import AssetsRepository from '../Repositories/AssetsRepository'
import { errorMessageLogToServer } from '../Services/network/network-services'
import RNFS from 'react-native-fs';
class AssetsService {
    assetsRepository;
    constructor() {
        assetsRepository = new AssetsRepository();
    }

    async getAssets() {
        return await assetsRepository.getAssets();
    }
    async downloadAllAssets(images) {
        var downloadStatusFlag = true;
        for (var i = 0; i < images.data.length; i++) {
            const imageUrl = images.data[i];
            const localImagePath = `file://${RNFS.DocumentDirectoryPath}/${imageUrl.substring(imageUrl.lastIndexOf('/') + 1,)}`
            const response = await RNFS.downloadFile({ fromUrl: imageUrl, toFile: localImagePath }).promise;
            if (response.statusCode !== 200) {
                downloadStatusFlag = false;
                console.log(`Error is appearing when downloading resource ${imageUrl}`);
                errorMessageLogToServer(`lỗi không tải được hình ảnh hoặc đường link hình ảnh không đúng:${imageUrl}`, Constants.SERVER_URL_USER + ServiceEnum.ASSETS);
            }
        }
        const folderExists = await RNFS.exists(`file://${RNFS.DocumentDirectoryPath}/camera.txt`, 'utf8');
        if (folderExists == false) {
            await RNFS.writeFile(`file://${RNFS.DocumentDirectoryPath}/camera.txt`, '', 'utf8',);
        }
        return downloadStatusFlag;
    }
}

export default AssetsService;