
import ServiceEnum from './../Variables/ServiceEnum';
import { Constants } from '../Config';
import { postData } from '../Services/network/network-services';
class LogRepository {
    constructor() {

    }
    async logTemperture(payload) {
        const data = await postData(Constants.SERVER_URL_USER + ServiceEnum.TEMPERTURE, payload);
        return data;
    }
    async logUPS(payload) {
        const data = await postData(Constants.SERVER_URL_USER + ServiceEnum.LOGUPS, payload);
        return data;
    }
    async logPrinter(payload) {
        const data = await postData(Constants.SERVER_URL_USER + ServiceEnum.PRINTER, payload);
        return data;
    }
}

export default LogRepository;