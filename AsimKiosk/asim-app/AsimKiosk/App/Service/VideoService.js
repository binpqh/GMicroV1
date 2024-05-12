import VideoRepository from "../Repositories/VideoRepository";
class VideoService {
    videoRepository;
    constructor() {
        videoRepository = new VideoRepository();
    }

    async handleStartRecording() {
        return await videoRepository.handleStartRecording();
    }

    async sendToServer() {
        return await videoRepository.sendToServer();
    }

    async handleStopRecording() {
        return await videoRepository.handleStopRecording();
    }

    async removeVideo() {
        return await videoRepository.removeVideo();
    }

    async reSyncFileVideo() {
        return await videoRepository.reSyncFileVideo();
    }
}

export default VideoService;