import StaticData from "../Variables/StaticData";
import VideoService from "../Service/VideoService";
class IntervalVideo {
    videoService
    flag;
    interval;
    constructor() {
        this.videoService = null;
        this.flag = false;
        this.interval = null;

    }

    startInterval() {

        this.interval = setInterval(async () => {
            if (StaticData.video == -1) {
                this.videoService = new VideoService();
                await this.videoService.handleStopRecording();
                this.videoService.removeVideo()
                this.videoService = null;
                StaticData.video = 0;
                this.flag = false;
            }

            if (StaticData.video == 1 && this.flag == false) {
                this.flag = true;
                this.videoService = new VideoService();
                this.videoService.handleStartRecording();
            }

            if (StaticData.video == 2) {
                this.videoService = new VideoService();
                await this.videoService.handleStopRecording();
                this.videoService.sendToServer();
                this.videoService = null;
                StaticData.video = 0;
                this.flag = false;
            }
        }, 3000);
    }
}

export default IntervalVideo;
