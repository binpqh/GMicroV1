import { uploadVideo } from '../Services/network/network-services';
import StaticData from '../Variables/StaticData';
import RNFS from 'react-native-fs';
class VideoRepository {
    constructor() {
    }

    delay = millis =>
        new Promise((resolve, reject) => {
            setTimeout(_ => resolve(), millis);
        });
    // /bắt đầu quay video
    async handleStartRecording() {
        StaticData.captureVideo = false;
        StaticData.captureViceoUrl = "";
        const recording = await StaticData.cameraServices.current?.recordAsync();
        StaticData.captureViceoUrl = recording;
    }
    ////dừng quá trình quay video 
    async handleStopRecording() {
        await StaticData.cameraServices.current.stopRecording();
    }
    // file video được lấy từ thư mục cache của ứng dụng upload lên server nếu upload thành công file video sẽ được xóa còn thất bại sẽ được lưu vào thư mục cache/camera.txt
    async sendToServer() {
        if (StaticData.captureVideo == true) {
        while (StaticData.captureViceoUrl == "") {
            await this.delay(3000);
        }
        var date = new Date().getTime(); 
        const uploadVideoResult = await uploadVideo(StaticData.captureViceoUrl.uri, date);
        if (uploadVideoResult.status == false) {
            const existingData = await RNFS.readFile(`file://${RNFS.DocumentDirectoryPath}/camera.txt`, 'utf8');
            const combinedData = existingData + (existingData ? '\n' : '') + StaticData.captureViceoUrl.uri;
            await RNFS.writeFile(`file://${RNFS.DocumentDirectoryPath}/camera.txt`, combinedData, 'utf8',);
        }
        if (uploadVideoResult.status == true) {
            await RNFS.unlink(StaticData.captureViceoUrl.uri);
        }
    }
    }

    async removeVideo() {
        await RNFS.unlink(StaticData?.captureViceoUrl?.uri);
    }

    async reSyncFileVideo() {
        var date = new Date().getTime();
        const existingData = await RNFS.readFile(`file://${RNFS.DocumentDirectoryPath}/camera.txt`, 'utf8');
        const lines = existingData.split('\n');
        for (var i = lines.length - 1; i >= 0; i--) {
            const uploadVideoResult = await uploadVideo(lines[i], date);
            if (uploadVideoResult.status == true) {
                await RNFS.unlink(lines[i]);
                lines.splice(i, 1);
            }
        }
        await RNFS.writeFile(`file://${RNFS.DocumentDirectoryPath}/camera.txt`, lines, 'utf8');
    }
}

export default VideoRepository;