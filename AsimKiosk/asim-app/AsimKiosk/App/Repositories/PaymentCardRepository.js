import ServiceEnum from './../Variables/ServiceEnum';
import { Constants } from '../Config';
import { postData, getData } from '../Services/network/network-services';
class PaymentCardRepository {
    constructor() {
    }

    async createOrder(payload) {
        const data = await postData(Constants.SERVER_URL_USER + ServiceEnum.ORDER_SIM, payload);
        return data;
    }
    async createPaymentSession(payload) {
        const data = await postData(Constants.SERVER_URL_USER + ServiceEnum.PAYMENT, payload);
        return data;
    }
    async addPackageSim(payload) {
        const data = await postData(Constants.SERVER_URL_USER + ServiceEnum.ADD_PACKAGE_SIM, payload);
        return data;
    }
}

export default PaymentCardRepository;