import UPSRepository from "../Repositories/UPSRepository";
class UPSSevice {
    upsRepository;
    constructor() {
        upsRepository = new UPSRepository();
    }

    async getBatteryLevel() {
        return await upsRepository.getBatteryLevel();
    }
    async getTemperature() {
        return await upsRepository.getTemperature();
    }

    async getInforUPSControl() {
        return await upsRepository.getInforUPSControl();
    }
    async getInforUPSControlv1() {
        return await upsRepository.getInforUPSControlv1();
    }

    // async getInputVoltage() {
    //     return await upsRepository.getInputVoltage();
    // }
    async temperatureSend(temperature) {
        return await upsRepository.temperatureSend(temperature);
    }

    async upsInforSend(upsBattery, batery) {
        return await upsRepository.upsInforSend(upsBattery, batery);
    }
}

export default UPSSevice;