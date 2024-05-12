import HardwareRepository from '../Repositories/HardwareRepository'
class HardwareService {
    hardwareRepository;
    constructor() {
        hardwareRepository = new HardwareRepository();
    }

    async getSerialNumber() {
        return  await hardwareRepository.getSerialNumber();
    }
}

export default HardwareService;