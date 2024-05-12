
import PaymentCardRepository from '../Repositories/PaymentCardRepository';
import SimRepository from '../Repositories/SimRepository';
class SimService {
    paymentCardRepository;
    simRepository;
    constructor() {
        paymentCardRepository = new PaymentCardRepository();
        simRepository = new SimRepository();
    }

    async addPackageSim(payload) {
        return await paymentCardRepository.addPackageSim(payload);
    }

    chooseTypeServices(simType, checkQuantity) {
        return simRepository.chooseTypeServices(simType, checkQuantity);
    }

    countQuantitySim(sim) {
        return simRepository.countQuantitySim(sim);
    }

    minusQuantitySim(sim) {
        return simRepository.minusQuantitySim(sim);
    }
    chooseSim(choose, code, hotLine, name, icon, colorCode) {
        return simRepository.chooseSim(choose, code, hotLine, name, icon, colorCode);
    }
}

export default SimService;