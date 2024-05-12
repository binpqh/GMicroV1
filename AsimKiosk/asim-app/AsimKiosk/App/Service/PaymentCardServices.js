
import PaymentCardRepository from '../Repositories/PaymentCardRepository';
class PaymentCardServices {
    paymentCardRepository;
    constructor() {
        paymentCardRepository = new PaymentCardRepository();
    }

    async createOrder(payload) {
        return await paymentCardRepository.createOrder(payload);
    }
    async createPaymentSession(payload) {
        return await paymentCardRepository.createPaymentSession(payload);
    }
    async addPackageSim(payload) {
        return await paymentCardRepository.addPackageSim(payload);
    }
}

export default PaymentCardServices;