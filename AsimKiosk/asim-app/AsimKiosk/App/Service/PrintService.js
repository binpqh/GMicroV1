import PrintRepository from "../Repositories/PrintRepository";
class PrintService {
    printRepository;
    constructor() {
        printRepository = new PrintRepository();
    }

    async statusOutOfPaper() {
        return await printRepository.statusOutOfPaper();
    }
    async printBill() {
        return await printRepository.printBill();
    }
    async checkPaper() {
        return await printRepository.checkPaper();
    }
}

export default PrintService;