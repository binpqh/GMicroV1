import { NativeModules } from 'react-native';
const { DevicePeripherals } = NativeModules;
class HardwareRepository {
    constructor() {
    }
    async getSerialNumber() {
        const data = await DevicePeripherals.getSerial();
        return data;
    }
}

export default HardwareRepository;