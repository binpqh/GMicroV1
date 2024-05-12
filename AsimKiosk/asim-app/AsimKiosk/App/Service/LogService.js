import LogRepository from '../Repositories/LogRepository'
class LogService {
    logRepository;
    constructor() {
        logRepository = new LogRepository();
    }

    async logTemperture(payload) {
        return await logRepository.logTemperture(payload);
    }
    async logUPS(payload) {
        return await logRepository.logUPS(payload);
    }
    async logPrinter(payload) {
        return await logRepository.logPrinter(payload);
    }
}

export default LogService;